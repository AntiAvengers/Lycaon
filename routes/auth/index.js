import express from 'express';
const router = express.Router();

import login_routes from './login.js';

router.use("/login", login_routes);

export default router;
