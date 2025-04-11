const router = require("express").Router();

const sui_controller = require('../../controllers/auth/sui.js');

router.post("/", sui_controller.generate_UUID);
router.post("/verify_signature", sui_controller.login);

module.exports = router;