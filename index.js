const express = require('express');
const routes = require("./routes");

const firebase_admin = require('./database/firebaseConfig.js');

const app = express();
app.use(express.json());

app.use(routes);

app.listen(3000)