const router = require("express").Router();
const puzzle_controller = require("../../controllers/game/puzzle.js");
// const math_puzzle_controller = require("../../controllers/game/math_puzzle.js");
// const word_puzzle_controller = require("../../controllers/game/word_puzzle.js");

router.post("/", puzzle_controller.load);
router.post("/check-answer", puzzle_controller.check_answer);
router.post("/finish", puzzle_controller.finish);

// router.post("/math-puzzle", math_puzzle_controller.create);

module.exports = router;
