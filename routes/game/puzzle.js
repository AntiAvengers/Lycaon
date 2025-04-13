const router = require("express").Router();
const puzzle_controller = require("../../controllers/game/puzzle.js");

router.post("/", puzzle_controller.load);
router.post("/check-answer", puzzle_controller.check_answer);
router.post("/finish", puzzle_controller.finish);

module.exports = router;
