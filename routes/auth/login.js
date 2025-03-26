const router = require("express").Router();

const sui_controller = require('../../controllers/auth/sui.js');

router.post("/", sui_controller.connect)
router.get("/:address", sui_controller.generate_UUID);

module.exports = router;