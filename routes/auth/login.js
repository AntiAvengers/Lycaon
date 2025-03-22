const router = require("express").Router();

const sui_controller = require('../../controllers/auth/sui.js');

router.route("/")
    .post(sui_controller.connect)
    .get((req, res) => res.send("login logic to be implemented"));

module.exports = router;