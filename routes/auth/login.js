const router = require("express").Router();

const sui_controller = require('../../controllers/auth/sui.js');
const jwt_controller = require('../../controllers/auth/jwt.js');

router.post("/", sui_controller.generate_UUID);
router.post("/refresh", jwt_controller.refresh_JWT);
router.post("/verify_signature", sui_controller.login);

module.exports = router;