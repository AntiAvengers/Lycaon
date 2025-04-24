// const router = require("express").Router();
// const sprites_controller = require("../../controllers/users/sprites.js");

import express from 'express';
const router = express.Router();

import { create_mint_transaction, update_minted_digest } from '../../controllers/users/sprites.js';

router.post("/mint", create_mint_transaction);
router.post("/minted_digest", update_minted_digest);

// module.exports = router;
export default router;
