const router = require("express").Router();

const login_routes = require("./login");

router.use("/login", login_routes);

module.exports = router;
