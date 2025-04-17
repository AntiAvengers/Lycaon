// const jwt = require('jsonwebtoken');

import jwt from 'jsonwebtoken';

export const generateToken = (user, secret, lifetime) => {
    return jwt.sign(user, secret, { expiresIn: lifetime });
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

// module.exports = {
//   generateToken,
//   verifyToken
// };

// export default {
//   generateToken,
//   verifyToken
// };
