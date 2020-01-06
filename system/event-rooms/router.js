const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.get('/rooms', actions.getAllRooms);
router.get('/rooms/:roomId', actions.getSingleRoom);

router.post('/admin/:adminId/create-room', middlewares.verifyToken, actions.adminCreateRooms);

router.patch('/admin/:adminId/edit-room/:roomId', middlewares.verifyToken, actions.adminEditRoomInfo);

router.delete('/admin/:adminId/delete-room/:roomId', middlewares.verifyToken, actions.adminDeleteRooms);

module.exports = router;