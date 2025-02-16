const jwt = require("jsonwebtoken");
const { prisma } = require("../config/Database");
const JWT_SECRET = process.env.JWT_SECRET || 'KJHDKFJHSDKJFHKJSD'

const encodeBase64 = (text) => Buffer.from(text).toString('base64');
const decodeBase64 = (base64Text) => Buffer.from(base64Text, 'base64').toString('utf8');


// Middleware to verify the access token
const TOKEN_EXPIRY_TIME = 3600; // Example: 1 hour in seconds
const REFRESH_THRESHOLD = 0.85; // 85% of token expiry time

const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the Authorization header is present and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token missing or invalid" });
        }

        // Extract the token from the Authorization header
        const token = authHeader.split(" ")[1];

        // Decode and verify the token
        const initialDecode = decodeBase64(token);
        const finalDecode = jwt.verify(initialDecode, JWT_SECRET);
        

        // Check if the token is close to expiry
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenAge = currentTime - finalDecode.iat;
        const maxTokenAge = finalDecode.exp - finalDecode.iat;
        const thresholdTime = maxTokenAge * REFRESH_THRESHOLD;

        if (tokenAge >= thresholdTime && tokenAge < maxTokenAge) {
            // Token needs to be refreshed
            const newToken = await generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            res.setHeader('Authorization', `Bearer ${newToken}`);
        } else if (tokenAge >= maxTokenAge) {
            return res.status(401).json({ message: "Token has expired. Please log in again." });
        }

        // Attach the decoded user data to the request object
        req.user = finalDecode;
        next();
    } catch (error) {
        // Handle errors during token verification
        console.error('verifyAccessTokenError:', error);
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
};

const generateAccessToken = async (user) => {
    const initialEncode = jwt.sign(user, JWT_SECRET, { expiresIn: "24h" })
    const finalEncode = encodeBase64(initialEncode)
    return finalEncode
}

const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const { user: decodedToken } = req;
        // Check if decodedToken exists and if the user's role is allowed
        if (!decodedToken || !allowedRoles.includes(decodedToken.role)) {
            console.warn(`Access denied: User with role ${decodedToken ? decodedToken.role : 'None'} attempted to access protected resource.`);
            return res.status(403).json({ message: `Access denied: ${decodedToken.role} do not have permission.` });
        }

        // If the user has an allowed role, proceed to the next middleware/route handler
        next();
    };
};

module.exports = { verifyAccessToken, generateAccessToken, verifyRole };
