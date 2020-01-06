const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.get('/reservations', actions.getAllReservations);
router.post('/test', actions.makeReservations);

module.exports = router;