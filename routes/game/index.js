const router = require("express").Router();
const puzzle_route = require("./puzzle");
const fountain_route = require("./fountain");

router.use("/puzzle", puzzle_route);
router.use("/fountain", fountain_route);

module.exports = router;
