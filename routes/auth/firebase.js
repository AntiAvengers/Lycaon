import express from 'express';
const router = express.Router();

import { request_token } from '../../controllers/auth/firebase.js';

router.post("/", request_token);

export default router;