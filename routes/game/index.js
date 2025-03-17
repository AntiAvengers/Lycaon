const router = require("express").Router();
const puzzle_route = require("./puzzle");

router.use("/puzzle", puzzle_route);

module.exports = router;
