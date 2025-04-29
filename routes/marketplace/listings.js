import express from 'express';
const router = express.Router();

import { 
    check_tx, //dev
    request_listing_tx,
    execute_listing_tx,
    request_buy_tx,
    execute_buy_tx,
    request_cancel_tx,
    execute_cancel_tx,
} from '../../controllers/marketplace/listings.js';

router.post("/check_tx", check_tx); //dev

router.post("/request_listing_tx", request_listing_tx);
router.post("/execute_listing_tx", execute_listing_tx);
router.post("/request_buy_tx", request_buy_tx);
router.post("/execute_buy_tx", execute_buy_tx);
router.post("/request_cancel_tx", request_cancel_tx);
router.post("/execute_cancel_tx", execute_cancel_tx);

export default router;
