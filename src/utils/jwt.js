const jwt = require('jsonwebtoken');

const secretKey = '019f68fb-45a8-7558-a1e1-95636e5f8878';

const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = { 
    generateToken, 
    verifyToken,
    secretKey
};