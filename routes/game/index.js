import express from 'express';
const router = express.Router();

import puzzle_route from './puzzle.js';
import fountain_route from './fountain.js';
import pantry_route from './pantry.js';

router.use("/puzzle", puzzle_route);
router.use("/fountain", fountain_route);
router.use("/pantry", pantry_route);

export default router;
