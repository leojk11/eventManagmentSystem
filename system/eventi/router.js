const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.get('/events', actions.getAllEvents);
router.get('/admin/events', middlewares.verifyToken, actions.adminGetAllEvents);
router.get('/events-and-details', middlewares.verifyToken, actions.getAllEventsAndDetails);
router.get('/event/:eventId', actions.getEventById);
router.get('/:eventId/event-tickets', actions.getEventAndTickets);

router.post('/:userId/create-event', middlewares.verifyToken, actions.createEvent);
router.post('/:eventId/add-details', middlewares.verifyToken, actions.addDetails);

router.put('/:eventId/update-event', middlewares.verifyToken, actions.updateDetails);

router.delete('/admin/:eventId/delete-event', middlewares.verifyToken, actions.adminDeleteEvent);

module.exports = router;