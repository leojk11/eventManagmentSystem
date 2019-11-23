const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.post('/users/:userId/event/:eventId', actions.createTicket);

router.get('/admin/get-tickets', actions.adminGetAllTickets);
router.get('/admin/get-ticket/:eventId', actions.adminGetOnlyOneTicket);

module.exports = router;