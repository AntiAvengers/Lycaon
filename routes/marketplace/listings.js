import express from 'express';
const router = express.Router();

import { 
    get_listings,
    create_blockchain_listing,
    confirm_blockchain_listing, 
} from '../../controllers/marketplace/listings.js';

router.get("/", get_listings);
router.post("/create", create_blockchain_listing);
router.post("/confirm_listing", confirm_blockchain_listing);

export default router;
