const router = require("express").Router();
const stats_controller = require("../../controllers/users/stats.js");

router.post("/get_user_profile", stats_controller.get_user_profile);

module.exports = router;
