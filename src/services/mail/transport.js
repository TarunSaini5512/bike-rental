const nodemailer = require('nodemailer');
const config = require('../../config/config');

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure, // true for 465, false for other ports
    auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
    },
});

/**
 * Sends an individual email.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} html - HTML content of the email.
 * @param {string} [text] - Optional plain text version.
 * @returns {Promise<boolean>} - Returns true if email sent successfully, false otherwise.
 */
const sendEmail = async (to, subject, html, text = '') => {
    try {
        const info = await transporter.sendMail({
            from: config.smtp.fromEmail,
            to,
            subject,
            html,
            text, // Optional plain text fallback
        });

        console.log(`✅ Email sent to ${to}. Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`❌ Error sending email to ${to}: ${error.message}`);
        return false;
    }
};

/**
 * Sends bulk emails in batches with delay to prevent server overload.
 * @param {Array} data - List of email payloads ({ email, subject, html, text }).
 * @param {number} batchSize - Number of emails per batch (default: 10).
 * @param {number} delay - Delay in milliseconds between batches (default: 1000ms).
 */
const sendBulkEmails = async (data, batchSize = 10, delay = 1000) => {
    console.log(`📩 Sending ${data.length} emails in batches of ${batchSize}...`);

    for (let i = 0; i < data.length; i += batchSize) {
        const emailBatch = data.slice(i, i + batchSize);

        await Promise.all(
            emailBatch.map(({ email, subject, html, text }) => sendEmail(email, subject, html, text))
        );

        if (i + batchSize < data.length) {
            console.log(`⏳ Waiting ${delay} ms before sending the next batch...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    console.log(`✅ All emails have been sent.`);
};

module.exports = {
    sendEmail,
    sendBulkEmails,
};
