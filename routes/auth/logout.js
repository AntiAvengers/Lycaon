import express from 'express';
const router = express.Router();

import { logout } from '../../controllers/auth/logout.js';

router.post("/", logout);

export default router;