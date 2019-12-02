const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.post('/users/:userId/create-ticket/:eventId', actions.createTicket);

router.get('/available-tickets', actions.getAllAvailableTickets);
router.get('/my-tickets/:userId', actions.getMyTickets);
router.get('/admin/get-tickets', actions.adminGetAllTickets);
router.get('/admin/get-ticket/:eventId', actions.adminGetOnlyOneTicket);

module.exports = router;