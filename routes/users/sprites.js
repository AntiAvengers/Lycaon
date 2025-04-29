import express from 'express';
const router = express.Router();

import { 
    request_mint_tx,
    execute_mint_tx,
    read_sprite,
    read_all_sprites,
    update_sprite 
} from '../../controllers/users/sprites.js';

router.post("/request_mint_tx", request_mint_tx);
router.post("/execute_mint_tx", execute_mint_tx);

router.post("/update_sprite", update_sprite);
router.post("/read_sprite", read_sprite);
router.post("/read_all_sprites", read_all_sprites);

export default router;
