const router = require("express").Router();
const puzzle_route = require("./puzzle");
const { authenticateJWT } = require('../../controllers/auth/jwt');

router.use(authenticateJWT);
router.use("/puzzle", puzzle_route);

module.exports = router;
