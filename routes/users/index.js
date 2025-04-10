const router = require("express").Router();
const stats_route = require("./stats");
const { authenticateJWT } = require('../../controllers/auth/jwt');

// router.use(authenticateJWT);
router.use("/stats", stats_route);

module.exports = router;
