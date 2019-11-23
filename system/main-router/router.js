const express = require('express');
const userRoutes = require('../users/router');
const eventsRoutes = require('../eventi/router');
const cardRoutes = require('../credit-cards/router');
const ticketRoutes = require('../tickets/router');

const mainRouter = express.Router();

mainRouter.use(userRoutes);
mainRouter.use(eventsRoutes);
mainRouter.use(cardRoutes);
mainRouter.use(ticketRoutes);

module.exports = mainRouter;