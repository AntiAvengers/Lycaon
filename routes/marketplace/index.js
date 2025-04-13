const router = require("express").Router();
const listings_route = require("./listings");

router.use("/listings", listings_route);

module.exports = router;
