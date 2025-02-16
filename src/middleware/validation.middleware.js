const Joi = require('joi');


// Reusable function for validation with improved error handling
const validateRequest = (schema, abortEarly = false) => (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request: No request body provided.',
                errorType: 'MISSING_BODY',
            });
        }

        const { error } = schema.validate(req.body, { abortEarly });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errorType: 'VALIDATION_ERROR',
                errorCount: error.details.length,
                errors: error.details.map(({ path, message }) => ({
                    field: path[0],
                    message,
                })),
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error during validation',
            errorType: 'VALIDATION_EXCEPTION',
        });
    }
};

// Updated schemas with better role validation
const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),

    role: Joi.string().valid("USER").required(),

    email: Joi.string().email().lowercase().required(),

    phone: Joi.string().required(),
});

const otpSchema = Joi.object({
    phone: Joi.string().required(),

    otp: Joi.string().length(6).required(),
});

// Middleware with validation
const validateSignup = validateRequest(signupSchema);
const validateOtp = validateRequest(otpSchema);

module.exports = { validateSignup, validateOtp };
