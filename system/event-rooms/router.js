const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.get('/admin/rooms', actions.getAllRooms);
router.get('/room/:roomId', actions.getSingleRoom);

router.post('/admin/create-room', actions.adminCreateRooms);

router.delete('/delete-room/:roomId', actions.adminDeleteRooms);

module.exports = router;