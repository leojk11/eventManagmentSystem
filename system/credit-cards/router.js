const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.post('/add-card/:id',  actions.addCard);

router.patch('/add-money/:userId', actions.insertMoney);
router.patch('/buy-ticket/:ticketId/:userId', actions.buyTicket);

router.delete('/delete-card/:cardId', actions.deleteCard);

router.get('/admin/all-cards', actions.adminGelAllCards);
router.get('/one-card', actions.getOneCard);

module.exports = router;