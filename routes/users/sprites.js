const router = require("express").Router();
const sprites_controller = require("../../controllers/users/sprites.js");

router.post("/mint", sprites_controller.create_mint_transaction);

module.exports = router;
