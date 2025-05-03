import express from 'express';
const router = express.Router();

import { get_pull_rates, pull } from '../../controllers/game/fountain.js';

router.post("/pull", pull);
router.post("/get-pull-rates", get_pull_rates);

export default router;
