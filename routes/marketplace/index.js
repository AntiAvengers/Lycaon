const router = require("express").Router();
const listings_route = require("./listings");
const { authenticateJWT } = require('../../controllers/auth/jwt');

// router.use(authenticateJWT);
router.use("/listings", listings_route);

module.exports = router;
