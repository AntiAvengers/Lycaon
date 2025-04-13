const jwt = require('../utils/jwt');
const dotenv = require('dotenv');

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const ACCESS_TOKEN_LIFETIME = '20m';  //minutes
const REFRESH_TOKEN_LIFETIME = '7d'; // days

const has_wallet_address = (req, res, next) => {
    const { address } = req.body;

    if(!address) {
        return res.status(403).json({ error: "Wallet Address was not provided in request body" });
    }

    next();
};

const authenticate_JWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
      const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  
      const decoded = jwt.verifyToken(token, ACCESS_TOKEN_SECRET);
      if (!decoded) {
        return res.status(403).json({ error: "Invalid or expired token." });
      }
    
      req.user = decoded;
      next();
    } catch(err) {
      console.error(err);
      return res.status(403).json({ error: err });
    }
};

module.exports = {
    has_wallet_address,
    authenticate_JWT
}