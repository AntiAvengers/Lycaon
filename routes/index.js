// const path = require("path");
// const router = require("express").Router();

// const { has_wallet_address, authenticate_JWT } = require('../middleware/auth');

// const auth_routes = require("./auth");
// const game_routes = require("./game");
// const marketplace_routes = require("./marketplace");
// const users_routes = require("./users");

// import path from 'path';
import express from 'express';
const router = express.Router();

import { has_wallet_address, authenticate_JWT } from '../middleware/auth.js';

import auth_routes from './auth/index.js';
import game_routes from './game/index.js';
import marketplace_routes from './marketplace/index.js';
import users_routes from './users/index.js';

// API Routes
router.use(has_wallet_address);
router.use("/auth", auth_routes);
// router.use(authenticate_JWT);
router.use("/game", game_routes);
router.use("/marketplace", marketplace_routes);
router.use("/users", users_routes);

//Once Front End is setup => ..wait I can do that now...#lol
router.use((req, res) => res.send("THIS IS DEFAULT REACT APP"));

// module.exports = router;
export default router;
