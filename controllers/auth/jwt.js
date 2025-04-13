const jwt = require('../../utils/jwt');

const dotenv = require('dotenv');

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const refresh_JWT = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Assuming refresh token is stored in cookies
    const { address } = req.body;
  
    if (!refreshToken) {
      return res.status(403).json({ message: "No refresh token provided." });
    }
  
    try {
      const decoded = jwt.verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
      const userId = decoded.userId; // Extract user info from the decoded token
  
      const newAccessToken = jwt.generateToken(
        { address },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
  
      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }
  };
  

module.exports = {
    refresh_JWT
}