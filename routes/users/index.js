// const router = require("express").Router();
// const stats_route = require("./stats");
// const sprites_route = require('./sprites');

import express from 'express';
const router = express.Router();

import stats_route from './stats.js';
import sprites_route from './sprites.js';

router.use("/stats", stats_route);
router.use("/sprites", sprites_route);

// module.exports = router;
export default router;
