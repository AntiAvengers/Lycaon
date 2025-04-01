const router = require("express").Router();
const puzzle_controller = require("../../controllers/game/puzzle.js");
const math_puzzle_controller = require("../../controllers/game/math_puzzle.js");
const word_puzzle_controller = require("../../controllers/game/word_puzzle.js");

router.route("/").post(puzzle_controller.load);
// router.post("/math-puzzle", math_puzzle_controller.create);
router.post("/word-puzzle", word_puzzle_controller.check_answer);

module.exports = router;
