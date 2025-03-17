const express = require('express');
const routes = require("./routes");

const database = require('./database/firebaseConfig.js');

const app = express();

app.use(routes);

app.listen(3000)