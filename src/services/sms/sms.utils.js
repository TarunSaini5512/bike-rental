const crypto = require('crypto');
const twilio = require('twilio');
const config = require('../../config/config.js');

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

const generateOTP = (length = 6) => {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

const sendOTP = async (phone, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: config.twilio.phoneNumber,
            to: phone,
        });

        console.log(`OTP sent successfully to ${phone}. Message SID: ${message.sid}`);
        return true;
    } catch (error) {
        console.error(`Failed to send OTP to ${phone}:`, error.message);
        throw new Error('Could not send OTP. Please try again later.');
    }
};
module.exports = { generateOTP, sendOTP }