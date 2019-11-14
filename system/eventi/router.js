const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const {createEvent, getAllEvents, adminGetAllEvents, adminDeleteEvent} = actions;
const {verifyToken} = middlewares;

const router = express.Router();

router.get('/events', getAllEvents);
router.get('/admin/events',verifyToken, adminGetAllEvents);
router.post('/:userId/create-event', verifyToken, createEvent);
router.delete('/admin/delete-event/:eventId', verifyToken, adminDeleteEvent)

module.exports = router;