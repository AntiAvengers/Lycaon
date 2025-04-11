const router = require("express").Router();
const listings_controller = require("../../controllers/marketplace/listings.js");

router.get("/", listings_controller.get_listings);

module.exports = router;
