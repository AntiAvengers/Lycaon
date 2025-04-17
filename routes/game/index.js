// const router = require("express").Router();
// const puzzle_route = require("./puzzle");
// const fountain_route = require("./fountain");

import express from 'express';
const router = express.Router();

import puzzle_route from './puzzle.js';
import fountain_route from './fountain.js';

router.use("/puzzle", puzzle_route);
router.use("/fountain", fountain_route);

// module.exports = router;

export default router;
