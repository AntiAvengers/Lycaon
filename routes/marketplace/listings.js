// const router = require("express").Router();
// const listings_controller = require("../../controllers/marketplace/listings.js");

import express from 'express';
const router = express.Router();

import { get_listings } from '../../controllers/marketplace/listings.js';

router.get("/", get_listings);

// module.exports = router;
export default router;
