const express = require('express');
const userRoutes = require('../users/router');
const eventsRoutes = require('../eventi/router');

const mainRouter = express.Router();

mainRouter.use(userRoutes);
mainRouter.use(eventsRoutes);

module.exports = mainRouter;