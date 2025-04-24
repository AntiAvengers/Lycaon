import jwt from 'jsonwebtoken';

export const generateToken = (user, secret, lifetime) => {
    return jwt.sign(user, secret, { expiresIn: lifetime });
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

