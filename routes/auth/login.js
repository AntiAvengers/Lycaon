const router = require("express").Router();

const sui_controller = require('../../controllers/auth/sui.js');

router.post("/", sui_controller.login);
router.post("/validate_wallet", sui_controller.connect);
router.get("/:address", sui_controller.has_account);

module.exports = router;