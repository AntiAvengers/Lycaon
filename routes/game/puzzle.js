const router = require("express").Router();
const puzzle_controller = require("../../controllers/puzzle.js");
const math_puzzle_controller = require("../../controllers/math_puzzle.js");
const word_puzzle_controller = require("../../controllers/word_puzzle.js");

router.route("/").post(puzzle_controller.init);
router.post("/math-puzzle", math_puzzle_controller);
router.post("/word-puzzle", word_puzzle_controller);

module.exports = router;
