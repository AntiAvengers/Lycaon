import { generateToken, verifyToken } from '../utils/jwt.js';
import 'dotenv/config';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, MODE } = process.env;
const ACCESS_TOKEN_LIFETIME = '20m';  //minutes
const REFRESH_TOKEN_LIFETIME = '7d'; // days

export const has_wallet_address = (req, res, next) => {
    if(MODE == "DEVELOPMENT") {
      const { address } = req.body;
      if(!address) {
        return res.status(403).json({ error: "Wallet Address was not provided in request body" });
      }
    } else if(!req.user) {
      return res.status(403).json({ error: "Wallet Address was not provided in request body" }); 
    }
    next();
};

export const authenticate_JWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
      const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  
      verifyToken(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user;
        next();
      });
    } catch(err) {
      console.error(err);
      return res.status(403).json({ error: err });
    }
};