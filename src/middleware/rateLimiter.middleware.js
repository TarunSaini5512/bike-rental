const NodeCache = require('node-cache');

const otpRequestCache = new NodeCache({ stdTTL: 86400, checkperiod: 120 }); // 24-hour cache

const rateLimiter = async (phone) => {
    const key = `otp_request_${phone}`;
    const requestData = otpRequestCache.get(key);

    const currentTime = Date.now();

    if (requestData) {
        let { count, lastRequestTime } = requestData;
        const timeElapsed = (currentTime - lastRequestTime) / 1000; // Convert ms to seconds

        // If user has reached max attempts (5), enforce a 24-hour lockout
        if (count >= 5) {
            const lockoutRemaining = Math.ceil(86400 - (currentTime - lastRequestTime) / 1000); // in seconds

            let displayTime;
            let remainingTime = {};

            const hours = Math.floor(lockoutRemaining / 3600); // Get hours
            const minutes = Math.floor((lockoutRemaining % 3600) / 60); // Get minutes
            const seconds = lockoutRemaining % 60; // Get remaining seconds

            // If remaining time is less than 1 hour, show in minutes and seconds
            if (lockoutRemaining < 3600) {
                displayTime = `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
            } else { // 1 hour or more, show hours, minutes, and seconds
                displayTime = `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
            }

            // Prepare remainingTime object with hours, minutes, and seconds
            remainingTime = { hour: hours, min: minutes, sec: seconds };

            return {
                isRateLimited: true,
                remainingTime: remainingTime,
                message: `Too many attempts. Try again after ${displayTime} or use the last OTP.`
            };
        }

        // Enforce 60-second wait time between requests
        const remainingTime = Math.ceil(60 - timeElapsed);
        if (remainingTime > 0) {
            return { isRateLimited: true, remainingTime, message: `Wait ${remainingTime} seconds before requesting OTP again.` };
        }

        // Update count and last request time
        otpRequestCache.set(key, { count: count + 1, lastRequestTime: currentTime }, 86400);
        return { isRateLimited: false, remainingTime: 0, message: "OTP sent successfully." };
    }
 
    // First-time request: Initialize counter
    otpRequestCache.set(key, { count: 1, lastRequestTime: currentTime }, 86400);
    return { isRateLimited: false, remainingTime: 0, message: "OTP sent successfully." };
};

module.exports = { rateLimiter };
