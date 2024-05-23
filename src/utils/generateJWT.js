const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateJWT = async (id) => { // TODO Implement it with e-mail and password
    return jwt.sign({ id }, process.env.JWT_SECRET || 'teste', {
        expiresIn: '30d',
    });
};

module.exports = generateJWT;