// const router = require("express").Router();
// const puzzle_controller = require("../../controllers/game/puzzle.js");

import express from 'express';
const router = express.Router();

import { load, check_answer, finish } from '../../controllers/game/puzzle.js';

router.post("/", load);
router.post("/check-answer", check_answer);
router.post("/finish", finish);

// module.exports = router;
export default router;
