const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.post('/users/:userId/create-ticket/:eventId', middlewares.verifyToken, actions.createTicket);

router.get('/available-tickets', middlewares.verifyToken, actions.getAllAvailableTickets);
router.get('/my-tickets/:userId', middlewares.verifyToken, actions.getMyTickets);
router.get('/tickets', actions.getAllTickets);
router.get('/tickets/:eventId', actions.getOnlyOneTicket);

module.exports = router;