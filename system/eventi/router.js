const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const {createEvent, getAllEvents, adminGetAllEvents, adminDeleteEvent} = actions;
const {verifyToken} = middlewares;

const router = express.Router();

router.get('/events', getAllEvents);
router.get('/admin/events',verifyToken, adminGetAllEvents);
router.get('/events-and-details', verifyToken, actions.getAllEventsAndDetails);

router.post('/:userId/create-event', verifyToken, createEvent);
router.post('/:eventId/add-details', verifyToken, actions.addDetails);

router.put('/update-event/:eventId', verifyToken, actions.updateDetails);

router.delete('/admin/delete-event/:eventId', verifyToken, adminDeleteEvent)

module.exports = router;