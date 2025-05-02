import { auth } from '../../database/firebaseConfig.js';

export const request_token = async (req, res) => {
    const { uid, claims } = req.body;
    try {
      const customToken = await auth.createCustomToken(uid, claims);
      res.status(200).json({ token: customToken });
    } catch (error) {
      console.error('Error creating custom token:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}