// const router = require("express").Router();
// const sprites_controller = require("../../controllers/users/sprites.js");

import express from 'express';
const router = express.Router();

import { create_mint_transaction } from '../../controllers/users/sprites.js';

router.post("/mint", create_mint_transaction);

// module.exports = router;
export default router;
