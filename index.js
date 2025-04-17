// const express = require('express');
// const routes = require("./routes");

// const firebase_admin = require('./database/firebaseConfig.js');
// const cors = require('cors');

import express from 'express';
import routes from './routes/index.js';

// import firebase_admin from './database/firebaseConfig.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(3000)