const jwt = require('jsonwebtoken');

const generateToken = (user, secret, lifetime) => {
    return jwt.sign(user, secret, { expiresIn: lifetime });
};

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
