import express from 'express';
const router = express.Router();

import { get_pantry, buy_food } from '../../controllers/game/pantry.js';

router.post("/get", get_pantry);
router.post("/buy", buy_food);

export default router;
