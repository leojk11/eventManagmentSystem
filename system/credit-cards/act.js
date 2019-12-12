const helper = require('../helper/helper');
const queries = require('./query');
const userQueries = require('../users/query');
const ticketQueries = require('../tickets/query');

addCard = async(req,res) => {
    const cardType = req.body.Card_type;
    const exMounth = req.body.Ex_mounth;
    const exYear = req.body.Ex_year;
    const cardNumber = req.body.Card_number;
    const cardOwnerName = req.body.Card_owner;
    const moneyAmount = 0;
    const userId = req.params.id;

    const cardNumbers = await queries.getOnlyCardNumber();
    const cardNumbersExist = cardNumbers.some(card => {
        return cardNumber == card.Card_number
    })
    // console.log(cardNumbersExist);

    if(cardType == "" || exMounth == "" || exYear == "" || cardNumber == "" || cardOwnerName == ""){
        res.status(400).json({
            message: 'Please enter card type, expiring mounth, expiring year, card number and card owner name.'
        })
    } else if(exMounth.length < 1 || exMounth > 12){
        res.status(400).json({
            message: `Ex. mounth ${exMounth} is not valid. Please enter another one.`
        })
    } else if(exYear.length < 4 || exYear < 2019) {
        res.status(400).json({
            message: `Ex. year ${exYear} is not valid. Please enter another one.`
        })
    }
    else if(cardNumber.toString().length < 16){
        res.status(400).json({
            message: 'Your card number must be at least 16 characters long.'
        })
    } 
    else if(cardNumbersExist == true){
        res.status(400).json({
            message: 'That card is already in use.'
        })
    } 
     else {
        try {
            const card = await queries.addCardQuery(cardType, exMounth, exYear, cardNumber, cardOwnerName, moneyAmount, userId);
            res.status(200).json({
                message: 'Card has been added.'
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

insertMoney = async(req, res) => {
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


    if(cardNumber == "" || amount == ""){
        res.statusn(400).json({
            message: 'Please enter card number and how much money you want to add.'
        })
    }
    else if(cardNumber.length < 16){
        res.status(400).json({
            message: `Card number ${cardNumber}, is not valid.`
        })
    } else if(cardNumbersExist == false) {
        res.status(400).json({
            message: `Card number ${cardNumber}, does not exist.`
        })
    } else {
        const addedCash = moneyAmount + amount;
        // console.log(addedCash);
        try {
            await queries.insertMoneyQuery(addedCash, userId);
            res.status(200).json({
                message: `${amount}$, have been added. Your new balace is ${addedCash}$.`
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};
buyTicket = async(req, res) => {
    const userId = req.params.userId;
    const ticketId = req.params.ticketId;
    const userCreditCard = req.body.Credit_card;
    const ticketAmount = req.body.Amount;

    const getUserMoneyBalance = await queries.getMoneyBalance(userId);
    const finalMoneyBalance = getUserMoneyBalance[0].Money;
    
    const getOneTicket = await ticketQueries.adminGetOnlyOneTicketQuery(ticketId); 
    const ticketPrice = getOneTicket[0].Price;
    const availableTicketAmount = getOneTicket[0].Available_amount;

    const leftTicketAmount = availableTicketAmount - ticketAmount;
    const finalTicketAmount = leftTicketAmount.toString();
    const totalTicketPrice = ticketPrice * ticketAmount;
    const boughtTicket = finalMoneyBalance - totalTicketPrice;
    
    

    const tickets = await ticketQueries.adminGetAllTicketsQuery();
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

    if(userCreditCard == "" || ticketAmount == "") {
        res.status(400).json({
            message: 'Please enter user credit card and ticket amount.'
        })
    } else if(ticketExist == false) {
        res.status(500).json({
            message: `Ticket with ID of ${ticketId}, does not exist.`
        })
    } else if(userExist == false) {
        res.status(500).json({
            message: `User with ID of ${userId}, does not exist.`
        })
    } else if(cardNumberExist == false) {
        res.status(400).json({
            message: `Card with number of ${userCreditCard}, does not exist.`
        })
    } else if(availableTicketAmount < 0) {
        res.status(400).json({
            message: 'No tickets are available.'
        })
    } else if(totalTicketPrice > finalMoneyBalance) {
        res.status(400).json({
            message: 'You don\'t have enough money to purchase that.'
        })
    }
    else {
        try {

            const updateMoney = await queries.insertMoneyQuery(boughtTicket, userId);
            const updateTicketAmount = await queries.buyTicketQuery(finalTicketAmount, ticketId);
            const finalCall = [updateMoney, updateTicketAmount];
            
            await finalCall;
            
            res.status(200).json({
                message: `You have bought ${ticketAmount} ticket(s). Total price will be ${totalTicketPrice}$.`
            })
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }
};

deleteCard = async(req, res) => {
    const cardId = req.params.cardId;

    const cardIds = await queries.getOnlyCardId();
    const cardIdsExist = cardIds.some(card => {
        return cardId == card.Id
    })

    if(cardIdsExist == false) {
        res.status(200).json({
            message: `Card with ID ${cardId}, has not been found.`
        })
    } else {
        try {
            await deleteCardQuery(cardId);
            res.status(200).json({
                message: `Card with ID ${cardId}, has been deleted.`
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

//ADMIN
adminGelAllCards = async(req, res) => {
    try {
        const cards = await queries.adminGetAllCardsQuery();
        res.status(200).json({
            cards
        })
    } catch (error) {
        res.status(500).send(error);
    }
};
getOneCard = async(req, res) => {
    const userId = req.params.userId;

    const users = await userQueries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    if(userExist == false) {
        res.status(400).json({
            message: `User with the ID of ${userId}, has not been found.`
        })
    } else {
        try {
            const card = await queries.getOneCardQuery(userId);
            res.status(200).send(card);
        } catch (error) {
            res.status(500).send(error);
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