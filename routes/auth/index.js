import express from 'express';
const router = express.Router();

import { authenticate_JWT } from '../../middleware/auth.js';

import login_routes from './login.js';
import logout_routes from './logout.js';
import firebase_routes from './firebase.js';

router.use("/login", login_routes);
router.use("/logout", logout_routes);
router.use("/firebase", authenticate_JWT, firebase_routes);

export default router;
