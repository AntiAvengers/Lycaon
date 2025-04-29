import express from 'express';
const router = express.Router();

import { 
    check_tx, //dev
    request_listing_tx,
    execute_listing_tx,
    buy,
} from '../../controllers/marketplace/listings.js';

router.post("/check_tx", check_tx); //dev

router.post("/request_listing_tx", request_listing_tx);
router.post("/execute_listing_tx", execute_listing_tx);
router.post("/buy", buy);

export default router;
