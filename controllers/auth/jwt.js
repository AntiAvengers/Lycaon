import { generateToken, verifyToken } from '../../utils/jwt.js';
import 'dotenv/config';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const refresh_JWT = async (req, res) => {
  console.log('refreshing jwt token for user');
  const refreshToken = req.cookies.refreshToken;
  console.log('123');

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided." });
  }

  try {
    const decoded = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
    const address = decoded.address;

    const newAccessToken = generateToken(
      { address },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token." });
  }
};