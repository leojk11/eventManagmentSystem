const express = require('express');
const bodyParser = require('body-parser');
const con = require('../DB/database');
const sysRouter = require('./main-router/router');

const app = express();

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 


app.use(sysRouter);




// SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});