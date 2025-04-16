const router = require("express").Router();
const stats_route = require("./stats");
const sprites_route = require('./sprites');

router.use("/stats", stats_route);
router.use("/sprites", sprites_route);

module.exports = router;
