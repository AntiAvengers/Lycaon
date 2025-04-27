// const router = require("express").Router();
// const sprites_controller = require("../../controllers/users/sprites.js");

import express from 'express';
const router = express.Router();

import { 
    request_mint_tx,
    execute_mint_tx,
    update_minted_digest,
    read_sprite,
    read_all_sprites,
    update_sprite 
} from '../../controllers/users/sprites.js';

router.post("/request_mint_tx", request_mint_tx);
router.post("/execute_mint_tx", execute_mint_tx);

router.post("/minted_digest", update_minted_digest);
router.post("/update_sprite", update_sprite);
router.post("/read_sprite", read_sprite);
router.post("/read_all_sprites", read_all_sprites);

// module.exports = router;
export default router;
