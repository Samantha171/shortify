const validator = require('validator');

const validateUrl = (url) => {
    return validator.isURL(url);
};

const validateEmail = (email) => {
    return validator.isEmail(email);
};

module.exports = { validateUrl, validateEmail };
