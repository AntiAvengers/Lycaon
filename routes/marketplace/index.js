import express from 'express';
const router = express.Router();

import listings_route from './listings.js';

router.use("/listings", listings_route);

export default router;
