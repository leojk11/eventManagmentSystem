const express = require('express');
const userRoutes = require('../users/router');

const mainRouter = express.Router();

mainRouter.use(userRoutes);

module.exports = mainRouter;