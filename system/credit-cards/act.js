const queries = require('./query');
const userQueries = require('../users/query');
const ticketQueries = require('../tickets/query');

addCard = async (req, res, next) => {
    const cardType = req.body.Card_type;
    const exMounth = req.body.Ex_mounth;
    const exYear = req.body.Ex_year;
    const cardNumber = req.body.Card_number;
    const cardOwnerName = req.body.Card_owner_name;
    const moneyAmount = 0;
    const userId = req.params.userId;

    const cardNumbers = await queries.getOnlyCardNumber();
    const cardNumbersExist = cardNumbers.some(card => {
        return cardNumber == card.Card_number
    });
    // console.log(cardNumbersExist);

    if (cardType == null || exMounth == null || exYear == null || cardNumber == null || cardOwnerName == null) {
        res.status(406).json({
            success: false,
            message: 'You must enter card type, expiring mounth, expiring yearm card number and card owner name.'
        });
    } else if (exMounth.length < 1 || exMounth > 12) {
        res.status(406).json({
            success: false,
            message: `Ex. mount ${exMounth} is not valid. Please try with another one.`
        });
    } else if (exYear.length < 4 || exYear < 2019) {
        res.status(406).json({
            success: false,
            message: `Ex. year ${exYear} is not valid. Please try with anoher one.`
        });
    } else if (cardNumber.toString().length < 16) {
        res.status(406).json({
            success: false,
            message: 'Your card number have to be at least 16 characters long.'
        });
    } else if (cardNumbersExist == true) {
        res.status(400).json({
            success: false,
            message: 'Card number is already in use. Try with another one.'
        });
    } else {
        try {
            await queries.addCardQuery(cardType, exMounth, exYear, cardNumber, cardOwnerName, moneyAmount, userId);
            res.status(200).json({
                message: 'Card has been added.'
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

insertMoney = async (req, res, next) => {
    const userId = req.params.userId;
    const cardNumber = req.body.Card_number;
    const amount = req.body.Amount;

    const cardNumbers = await queries.getOnlyCardNumber();
    const cardNumbersExist = cardNumbers.some(card => {
        return cardNumber == card.Card_number
    });

    const userPaymentInfo = await queries.getOneCardQuery(userId);
    const moneyAmount = userPaymentInfo[0].Money;
    // console.log(moneyAmount);


    if (cardNumber == null || amount == null) {
        res.status(400).json({
            success: false,
            message: 'Please enter card number and amout.'
        });
    } else if (cardNumber.length < 16) {
        res.status(400).json({
            success: false,
            message: `Card number ${cardNumber} is not valid. Please try with another one.`
        });
    } else if (cardNumbersExist == false) {
        res.status(400).json({
            success: false,
            message: `Card number ${cardNumber}, does not exist.`
        });
    } else {
        const addedCash = moneyAmount + amount;
        // console.log(addedCash);
        try {
            await queries.insertMoneyQuery(addedCash, userId);
            res.status(200).json({
                message: `${amount}$, have been added. Your new balace is ${addedCash}$.`
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};
buyTicket = async (req, res, next) => {
    const userId = req.params.userId;
    const ticketId = req.params.ticketId;
    const userCreditCard = req.body.Card_number;
    const ticketAmount = req.body.Amount;

    const getUserMoneyBalance = await queries.getMoneyBalance(userId);
    const finalMoneyBalance = getUserMoneyBalance[0].Money;

    const getOneTicket = await ticketQueries.getOnlyOneTicketQuery(ticketId);
    const ticketPrice = getOneTicket[0].Price;
    const availableTicketAmount = getOneTicket[0].Available_amount;

    const leftTicketAmount = availableTicketAmount - ticketAmount;
    const finalTicketAmount = leftTicketAmount.toString();
    const totalTicketPrice = ticketPrice * ticketAmount;
    const boughtTicket = finalMoneyBalance - totalTicketPrice;

    const tickets = await ticketQueries.getAllTicketsQuery();
    const ticketExist = tickets.some(ticket => {
        return ticketId == ticket.Id
    });

    const users = await userQueries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    const cards = await queries.adminGetAllCardsQuery();
    const cardNumberExist = cards.some(card => {
        return userCreditCard == card.Card_number
    });

    if (userCreditCard == null || ticketAmount == null) {
        res.status(400).json({
            success: false,
            message: 'Please enter user credit card and ticket amount.'
        });
    } else if (ticketExist == false) {
        res.status(400).json({
            success: false,
            message: `Ticket with ID if ${ticketId}, does not exist.`
        });
    } else if (userExist == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        });
    } else if (cardNumberExist == false) {
        res.status(400).json({
            success: false,
            message: `Card number ${userCreditCard}, does not exist.`
        });
    } else if (availableTicketAmount < 0) {
        res.status(400).json({
            success: false,
            message: 'No tickets are available.'
        });
    } else if (totalTicketPrice > finalMoneyBalance) {
        res.status(400).json({
            success: false,
            message: 'You don\'t have have enoung money to purchase that.'
        });
    } else {
        try {
            const updateMoney = await queries.insertMoneyQuery(boughtTicket, userId);
            const updateTicketAmount = await queries.buyTicketQuery(finalTicketAmount, ticketId);
            const finalCall = [updateMoney, updateTicketAmount];

            await finalCall;

            res.status(200).json({
                message: `You have bought ${ticketAmount} ticket(s). Total price will be ${totalTicketPrice}$.`
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

deleteCard = async (req, res, next) => {
    const cardId = req.params.cardId;

    const cardIds = await queries.getOnlyCardId();
    const cardIdsExist = cardIds.some(card => {
        return cardId == card.Id
    });

    if (cardIdsExist == false) {
        res.status(400).json({
            success: false,
            message: `Card with ID of ${cardId}, does not exist.`
        });
    } else {
        try {
            await deleteCardQuery(cardId);
            res.status(200).json({
                message: `Card with ID ${cardId}, has been deleted.`
            })
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

//ADMIN
adminGelAllCards = async (req, res, next) => {
    const adminId = req.params.adminId;

    const userTypes = await userQueries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;

    if (checkUserType == "client") {
        res.status(400).json({
            success: false,
            message: `User with ID of ${adminId}, does not have permissions to do that.`
        });
    } else {
        try {
            const cards = await queries.adminGetAllCardsQuery();
            res.status(200).json({
                cards
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};
getOneCard = async (req, res, next) => {
    const userId = req.params.userId;

    const users = await userQueries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    const cards = await queries.adminGetAllCardsQuery();
    const cardExist = cards.some(card => {
        return userId == card.User_id
    });

    if (userExist == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        });
    } else if (cardExist == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not have registered card.`
        });
    } else {
        try {
            const card = await queries.getOneCardQuery(userId);
            res.status(200).json({
                card
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = {
    addCard,
    insertMoney,
    deleteCard,
    adminGelAllCards,
    getOneCard,
    buyTicket
}