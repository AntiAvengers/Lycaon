const express = require('express');
const routes = require("./routes");

const firebase_admin = require('./database/firebaseConfig.js');

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(3000)