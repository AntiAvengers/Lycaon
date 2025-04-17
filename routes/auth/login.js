// const router = require("express").Router();

// const sui_controller = require('../../controllers/auth/sui.js');
// const jwt_controller = require('../../controllers/auth/jwt.js');

import express from 'express';
const router = express.Router();

import { login, generate_UUID } from '../../controllers/auth/sui.js';
import { refresh_JWT } from '../../controllers/auth/jwt.js';

router.post("/", generate_UUID);
router.post("/refresh", refresh_JWT);
router.post("/verify_signature", login);

// module.exports = router;

export default router;