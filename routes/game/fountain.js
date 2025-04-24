import express from 'express';
const router = express.Router();

import { pull } from '../../controllers/game/fountain.js';

router.post("/pull", pull);

export default router;
