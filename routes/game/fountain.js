const router = require("express").Router();
const fountain_controller = require("../../controllers/game/fountain.js");

router.post("/pull", fountain_controller.pull);

module.exports = router;
