// const router = require("express").Router();
// const fountain_controller = require("../../controllers/game/fountain.js");

import express from 'express';
const router = express.Router();

import { pull } from '../../controllers/game/fountain.js';

router.post("/pull", pull);

// module.exports = router;

export default router;
