import express from 'express';
const router = express.Router();

import { 
    create_blockchain_listing,
} from '../../controllers/marketplace/listings.js';

router.post("/create", create_blockchain_listing);

export default router;
