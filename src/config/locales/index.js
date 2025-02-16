const { en } = require('./en')
const data = {
    en,
};

module.exports.locale = (key, language = 'en') => data[language][key];

