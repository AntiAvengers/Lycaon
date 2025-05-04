import express from 'express';
const router = express.Router();

import { login, generate_UUID } from '../../controllers/auth/sui.js';
import { refresh_JWT } from '../../controllers/auth/jwt.js';
import { logout } from '../../controllers/auth/logout.js';

router.post("/", generate_UUID);
router.post("/refresh", refresh_JWT);
router.post("/verify_signature", login);
router.post("/logout", logout);

export default router;