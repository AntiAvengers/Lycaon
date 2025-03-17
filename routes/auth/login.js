const router = require("express").Router();

router.route("/")
    .get((req, res) => res.send("login logic to be implemented"));

module.exports = router;