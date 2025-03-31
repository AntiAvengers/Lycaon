const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const ACCESS_TOKEN_LIFETIME = '20m';  //minutes
const REFRESH_TOKEN_LIFETIME = '7d'; // days

const generateToken = (user, secret, lifetime) => {
    return jwt.sign(user, secret, { expiresIn: lifetime });
};

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  
    const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  
    req.user = decoded; // Attach user info to request
    next(); // Move to the next middleware/route handler
  };

module.exports = {
  generateToken,
  verifyToken,
  authenticateJWT
};
