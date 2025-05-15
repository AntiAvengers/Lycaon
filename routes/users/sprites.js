import express from 'express';
const router = express.Router();

import { 
    request_mint_tx,
    execute_mint_tx,
    update_sprite,
    get_lore,
    evolve_sprite
} from '../../controllers/users/sprites.js';

router.post("/request_mint_tx", request_mint_tx);
router.post("/execute_mint_tx", execute_mint_tx);

router.post("/update_sprite", update_sprite);
router.post("/get-lore", get_lore);
router.post("/evolve-sprite", evolve_sprite);

export default router;
