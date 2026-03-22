const { nanoid } = require('nanoid');

const generateCode = () => {
    return nanoid(8); // 8 character short code
};

module.exports = { generateCode };
