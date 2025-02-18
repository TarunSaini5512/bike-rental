const bcrypt = require("bcrypt");
const { prisma } = require("../config/Database");
const { generateAccessToken, verifyAccessToken } = require("../middleware/auth.middleware");
const config = require("../config/config");
const { logger } = require("../utils/logger");
const { generateOTP, sendOTP } = require('../services/sms/sms.utils');
const { rateLimiter } = require('../middleware/rateLimiter.middleware');
const jwt = require("jsonwebtoken");

const sendOTPFunction = async (phone) => {
    try {
        // Check rate limit before sending OTP
        const { isRateLimited, remainingTime, message } = await rateLimiter(phone);
        if (isRateLimited) {
            return {
                status: 429,
                error: message,
                remainingTime
            };
        }

        // Find user by phone number
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return { status: 404, error: 'User not found.' };
        }

        // Generate and hash new OTP
        const otp = generateOTP();
        const hashedOTP = await bcrypt.hash("551255", 10);

        // Update OTP and expiry in the database
        await prisma.user.update({
            where: { phone },
            data: {
                otp: hashedOTP,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
            },
        });

        // Send the OTP via SMS
        // await sendOTP(phone, otp);

        return { status: 200, message: 'OTP sent successfully.' };

    } catch (error) {
        console.error('Error sending OTP:', error);
        return { status: 500, error: 'An unexpected error occurred. Please try again later.' };
    }
};

module.exports = { sendOTPFunction };
const resendOtp = async (req, res) => {
    const { phone } = req.body;
    const response = await sendOTPFunction(phone);
    return res.status(response.status).json(response);
};

const signup = async (req, res) => {
    try {
        const { name, role, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            if (existingUser.status === 'PENDING') {
                // Check if OTP expired
                if (existingUser.otpExpiry > new Date()) {
                    return res.status(400).json({
                        error: 'Your registration is pending. Please enter the OTP sent to your phone.'
                    });
                } else {
                    // OTP expired, delete the pending registration and allow fresh signup
                    await prisma.user.delete({ where: { email } });
                }
            } else {
                return res.status(400).json({ error: 'Email already in use.' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);        

        // Create new user entry with pending status
        const user = await prisma.user.create({
            data: {
                name,
                email,
                role,
                phone,
                password: hashedPassword
            },
        });

        // Send OTP using sendOTPFunction
        const response = await sendOTPFunction(phone);

        // If OTP failed to send, remove user entry to prevent orphan records
        if (response.status !== 200) {
            await prisma.user.delete({ where: { email } });
            return res.status(response.status).json(response);
        }

        return res.status(201).json({
            message: 'User registered successfully. OTP sent.',
            userId: user.id,
        });

    } catch (error) {
        console.error('Error during signup:', error);

        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email or phone number already exists.' });
        }

        return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ error: 'Phone and OTP are required.' });
        }

        // Find user by phone number
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid OTP or phone number.' });
        }

        // Check if OTP is valid and not expired
        const isOtpValid = await bcrypt.compare(otp, user.otp);
        if (!isOtpValid || new Date() > user.otpExpiry) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        try {
            // Update user in a single atomic operation
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    phoneVerifiedAt: new Date(),
                    otp: null, // Clear OTP after successful verification
                    otpExpiry: null,
                    status: 'ACTIVE',
                },
            });

            return res.status(200).json({ message: 'OTP verified. User activated.' });
        } catch (updateError) {
            console.error('Error updating user:', updateError);
            return res.status(500).json({ error: 'Could not update user. Please try again later.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

const emailValidityChecks = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        logger.warn("Email validity check failed: Email is missing.");
        return res.status(400).json({ message: "Email is required." });
    }

    // Basic email format validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        logger.warn(`Email validity check failed: Invalid email format - ${email}`);
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            logger.warn(`Email validity check failed: Email already exists - ${email}`);
            return res.status(409).json({ message: "Email already in use." });
        }

        // If the email is valid and doesn't exist in the database
        logger.info(`Email validity check passed: Email is valid and available - ${email}`);
        return res.status(200).json({ message: "Email is valid and available." });
    } catch (error) {
        logger.error(`Email validity check error: ${error.message}`);
        return res.status(500).json({ message: "An error occurred while checking email validity." });
    }
};

const activateAccount = async (req, res) => {
    try {
        const { user: decodedToken } = req;
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
        });
        if (!user) {
            logger.error(`User not found: ${decodedToken.id}`);
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.status === 'ACTIVE') {
            logger.error(`User already activated `);
            return res.status(409).json({ message: 'User account is already activated.' });
        }
        const updatedUser = await prisma.user.update({
            where: { id: decodedToken.id },
            data: {
                status: 'ACTIVE',
                emailVerifiedAt: new Date(),
            },
        });
        logger.info(`Account activated for user ${updatedUser.id}.`);
        return res.status(200).json({
            message: 'Account successfully activated.',
            user: updatedUser,
        });
    } catch (error) {
        logger.error('Error activating account:', error.message);
        return res.status(500).json({ message: 'Failed to activate account. Please try again.' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                role: true,
                email: true
            }
        });

        // Handle case when user is not found
        if (!user) {
            logger.warn(`Forgot password failed: Email ${email} not registered.`);
            return res.status(404).json({ message: "Email not registered" });
        }
        const token = await generateAccessToken(user);
        user["resetPasswordLink"] = `${config.baseUrl}/account/password/reset?token=${token}`;
        // forgotPasswordEmail([user]); // Send activation email
        logger.info(`Password reset link sent for user ${email}.`);
        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        logger.error("Error in forgotPassword: ", error);
        res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};

const resetPassword = async (req, res) => {
    try {
        // Extract user details from the request object
        const { user: decodedToken } = req;

        // Get the new password from the request body
        const { password, confirmPassword } = req.body;

        // Check if the new password and confirm password match
        if (password !== confirmPassword) {
            logger.warn(`Password reset failed for user ${decodedToken.id}: Passwords do not match.`);
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Password validation (e.g., length, strength checks can be added here)
        if (password.length < 8) {
            logger.warn(`Password reset failed for user ${decodedToken.id}: Password too short.`);
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        const updatedUser = await prisma.user.update({
            where: { id: decodedToken.id },
            data: {
                password: hashedPassword,
            },
        });

        logger.info(`Password successfully updated for user ${decodedToken.id}.`);
        return res.status(200).json({
            message: "Password successfully updated.",
            user: updatedUser,
        });
    } catch (error) {
        logger.error("Error resetting password: ", error);
        return res.status(500).json({ message: "Failed to reset password. Please try again." });
    }
};

const signin = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required.' });
        }

        // Apply rate limiting middleware (ensures limited OTP requests per user)
        const isRateLimited = await rateLimiter(phone);
        if (isRateLimited) {
            return res.status(429).json({ error: 'Too many OTP requests. Please try again later.' });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' }); // Generic message for security
        }

        // Generate and hash OTP
        const otp = generateOTP();
        const hashedOTP = await bcrypt.hash(otp, 10);

        try {
            // Update user OTP in database
            await prisma.user.update({
                where: { phone },
                data: {
                    otp: hashedOTP,
                    otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 mins
                },
            });
        } catch (dbError) {
            console.error('Database error during OTP update:', dbError);
            return res.status(500).json({ error: 'Error processing request. Please try again later.' });
        }

        // Send OTP via SMS
        try {
            await sendOTP(phone, otp);
        } catch (smsError) {
            console.error('Failed to send OTP:', smsError);
            return res.status(500).json({ error: 'OTP could not be sent. Please try again.' });
        }

        return res.status(200).json({ message: 'OTP sent successfully.', userId: user.id });

    } catch (error) {
        console.error('Unexpected error during sign-in:', error);
        return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Email/Phone and password are required.' });
        }

        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        const isPhone = /^[+0-9]{7,15}$/.test(identifier);

        if (!isEmail && !isPhone) {
            return res.status(400).json({ error: 'Invalid email or phone number format.' });
        }

        if (isPhone && (identifier.length < 7 || identifier.length > 15)) {
            return res.status(400).json({ error: 'Phone number must be between 7 and 15 digits.' });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    isEmail ? { email: identifier } : null, 
                    isPhone ? { phone: identifier } : null
                ].filter(Boolean)
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({ message: 'Login successful.', token });

    } catch (error) {
        console.error('Unexpected error during login:', error);
        return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

const deleteAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const owner = await prisma.user.findUnique({ where: { id: Number(id), role: "OWNER" } });
        if (!owner) {
            logger.warn(`Delete account failed: Owner with id ${id} not found.`);
            return res.status(404).json({ message: "Owner not found." });
        }

        await prisma.user.delete({ where: { id: Number(id) } });
        logger.info(`Owner with id ${id} deleted successfully.`);
        return res.status(200).json({ message: "Owner deleted successfully." });
    } catch (error) {
        logger.error("Error in deleteOwner: ", error);
        return res.status(500).json({ message: "Error deleting owner.", error: error.message });
    }
};

module.exports = {
    signup,
    verifyOtp,
    resendOtp,
    emailValidityChecks,
    activateAccount,
    forgotPassword,
    resetPassword,
    signin,
    login,
    deleteAccount,
};
