// const router = require("express").Router();

// const login_routes = require("./login");

import express from 'express';
const router = express.Router();

import login_routes from './login.js';

router.use("/login", login_routes);

// module.exports = router;

export default router;
