// Load environment variables from .env file
require('dotenv').config();

// Define configuration variables
const config = {
    port: process.env.PORT || 3000,
    apiKey: process.env.API_KEY || '',
    environment: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    logLevel: process.env.LOG_LEVEL || 'info',
    smtp: {
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 587,
        user: process.env.SMTP_USER || '',
        password: process.env.SMTP_PASSWORD || '',
        fromEmail: process.env.SMTP_FROM_EMAIL || 'no-reply@example.com',
        secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
    },
    companyDetails: {
        companyName: process.env.COMPANY_NAME,
        year: process.env.YEAR,
        supportEmail: process.env.SUPPORT_EMAIL
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    },
    database: {
        url: process.env.DATABASE_URL
    }
};

// Export the config object
module.exports = config;