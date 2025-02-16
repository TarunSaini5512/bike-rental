const path = require('path');
const fs = require('fs').promises;

/**
 * Loads an email template and replaces placeholders with actual data.
 * @param {string} templateType - The template filename (without extension).
 * @param {Object} data - Key-value pairs for replacing placeholders in the template.
 * @returns {Promise<{ html: string } | null>} - The compiled email template or null if an error occurs.
 */
const loadTemplate = async (templateType, data) => {
    try {
        // Construct template path
        const templatePath = path.join(__dirname, '..', 'templates', `${templateType}.html`);

        // Read template file
        const html = await fs.readFile(templatePath, 'utf8');

        // Replace placeholders with actual data (defaulting to empty string if key is missing)
        const compiledHtml = html.replace(/{{(\w+)}}/g, (_, key) => data[key] ?? '');

        return { html: compiledHtml };
    } catch (error) {
        console.error(`❌ Error loading email template '${templateType}': ${error.message}`);
        return null; // Return null to avoid breaking the process
    }
};

module.exports = { loadTemplate };
