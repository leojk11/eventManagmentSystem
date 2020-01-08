const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.get('/reservations', actions.getAllReservations);
router.get('/my-reservations/:userId', actions.getMyReservations)

router.post('/make-reservation/:userId/:eventId', actions.makeReservations);

module.exports = router;