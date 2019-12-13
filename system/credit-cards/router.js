const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.post('/insert-card/:userId',  middlewares.verifyToken, actions.addCard);

router.patch('/insert-money/:userId', middlewares.verifyToken, actions.insertMoney);
router.patch('/buy-ticket/:ticketId/:userId', middlewares.verifyToken, actions.buyTicket);

router.delete('/delete-card/:cardId', middlewares.verifyToken, actions.deleteCard);

router.get('/admin/all-cards', middlewares.verifyToken, actions.adminGelAllCards);
router.get('/my-card/:userId', middlewares.verifyToken, actions.getOneCard);

module.exports = router;