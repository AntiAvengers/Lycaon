// const router = require("express").Router();
// const listings_route = require("./listings");

import express from 'express';
const router = express.Router();

import listings_route from './listings.js';

router.use("/listings", listings_route);

// module.exports = router;
export default router;
