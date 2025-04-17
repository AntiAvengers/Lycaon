// const router = require("express").Router();
// const stats_controller = require("../../controllers/users/stats.js");

import express from 'express';
const router = express.Router();

import { get_user_profile } from '../../controllers/users/stats.js';

router.post("/get_user_profile", get_user_profile);

// module.exports = router;
export default router;
