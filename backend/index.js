const express = require('express')
const app = express()

const database = require('./database/firebaseConfig.js');

app.get('/', function (req, res) {
    console.log(database);
    res.send("Hello World")
})

app.listen(3000)