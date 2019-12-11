const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.get('/events', actions.getAllEvents);
router.get('/events-details', middlewares.verifyToken, actions.getAllEventsAndDetails);
router.get('/events-details/:eventId', actions.getSingleEventAndDetails);
router.get('/events/:eventId', actions.getEventById);
router.get('/event-ticket/:eventId', actions.getEventAndTickets);

router.post('/create-event/:userId', middlewares.verifyToken, actions.createEvent);
router.post('/:eventId/add-details', middlewares.verifyToken, actions.addDetails);

router.put('/update-event/:eventId', middlewares.verifyToken, actions.updateDetails);

router.delete('/admin/:userId/delete-event/:eventId', middlewares.verifyToken, actions.adminDeleteEvent);

module.exports = router;