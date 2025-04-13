const router = require("express").Router();
const stats_route = require("./stats");

router.use("/stats", stats_route);

module.exports = router;
