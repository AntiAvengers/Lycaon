import express from 'express';
const router = express.Router();

import { get_user_profile } from '../../controllers/users/stats.js';

router.post("/get_user_profile", get_user_profile);

export default router;
