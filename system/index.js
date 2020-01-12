const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sysRouter = require('./main-router/router');
const helper = require('./helper/helper');



const app = express();

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());



app.use(sysRouter);
app.use(helper.wrongRoute);
app.use(helper.errorHandler);

// SERVER
// const port = 3000;
const port = process.env.PORT;
app.listen(port || 3020, () => {
    console.log(`App is listening on port ${port}`)
});