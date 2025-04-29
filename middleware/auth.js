import { generateToken, verifyToken } from '../utils/jwt.js';
import 'dotenv/config';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, MODE } = process.env;
const ACCESS_TOKEN_LIFETIME = '30m';  //minutes
const REFRESH_TOKEN_LIFETIME = '7d'; // days

//Deprecated Looking to delete in production
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

export const authenticate_JWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = await verifyToken(token, ACCESS_TOKEN_SECRET);
      req.user = { address: decoded.address };
      next();
    } catch(err) {
      return res.status(403).json({ error: err });
    }
};