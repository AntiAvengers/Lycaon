import express from 'express';
const router = express.Router();

import { 
    load, 
    check_answer, 
    finish, 
    use_key } from '../../controllers/game/puzzle.js';

router.post("/", load);
router.post("/check-answer", check_answer);
router.post("/finish", finish);
router.post("/use-key", use_key)

export default router;
