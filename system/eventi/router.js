const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const {createEvent} = actions;
const {verifyToken} = middlewares;

const router = express.Router();

router.post('/create=event', createEvent);

module.exports = router;