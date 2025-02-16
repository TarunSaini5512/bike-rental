const { loadTemplate } = require("./templates");
const { sendBulkEmails } = require("./transport");

/**
 * Generates email payloads for bulk sending.
 * @param {Array} users - List of users with email data.
 * @param {string} templateName - The name of the email template.
 * @param {string} subject - The email subject.
 * @returns {Promise<Array>} - List of email payloads.
 */
const generateEmailPayloads = async (users, templateName, subject) => {
    try {
        return await Promise.all(
            users.map(async (user) => {
                const { html } = await loadTemplate(templateName, user);
                return { email: user.email, subject, html };
            })
        );
    } catch (error) {
        console.error(`Error generating email payloads for ${templateName}:`, error.message);
        throw new Error('Failed to generate email payloads.');
    }
};

/**
 * Sends activation emails to users.
 * @param {Array} users - List of users.
 */
const activationEmail = async (users) => {
    const subject = 'Welcome to The Laundry Company - Activate Your Account Today!';
    try {
        console.log(`Sending activation emails to ${users.length} users...`);
        const emailPayloads = await generateEmailPayloads(users, 'activationEmail', subject);
        await sendBulkEmails(emailPayloads);
        console.log('✅ Activation emails sent successfully.');
    } catch (error) {
        console.error('❌ Error sending activation emails:', error.message);
    }
};

/**
 * Sends password reset emails to users.
 * @param {Array} users - List of users.
 */
const forgotPasswordEmail = async (users) => {
    const subject = 'Reset Your Password';
    try {
        console.log(`Sending password reset emails to ${users.length} users...`);
        const emailPayloads = await generateEmailPayloads(users, 'resetPasswordEmail', subject);
        await sendBulkEmails(emailPayloads);
        console.log('✅ Reset password emails sent successfully.');
    } catch (error) {
        console.error('❌ Error sending forgot password emails:', error.message);
    }
};

module.exports = { activationEmail, forgotPasswordEmail };
