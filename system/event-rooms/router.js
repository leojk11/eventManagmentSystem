const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.get('/rooms', actions.getAllRooms);
router.get('/room/:roomId', actions.getSingleRoom);

router.post('/admin/create-room', middlewares.verifyToken, actions.adminCreateRooms);

router.delete('/admin/delete-room/:roomId', middlewares.verifyToken, actions.adminDeleteRooms);

module.exports = router;