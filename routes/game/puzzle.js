import express from 'express';
const router = express.Router();

import { load, check_answer, finish } from '../../controllers/game/puzzle.js';

router.post("/", load);
router.post("/check-answer", check_answer);
router.post("/finish", finish);

export default router;
