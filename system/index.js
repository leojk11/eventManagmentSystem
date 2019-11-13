const express = require('express');
const bodyParser = require('body-parser');
const sysRouter = require('./main-router/router');


const app = express();

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(sysRouter);


// SERVER
// const port = 3000;
const port = process.env.PORT;
app.listen(port || 3020, () => {
    console.log(`App is listening on port ${port}`)
});