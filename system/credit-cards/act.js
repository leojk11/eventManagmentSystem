const queries = require('./query');
const userQueries = require('../users/query');
const ticketQueries = require('../tickets/query');

addCard = async(req, res, next) => {
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
    })
    // console.log(cardNumbersExist);

    if(cardType == null || exMounth == null || exYear == null || cardNumber == null || cardOwnerName == null){
        var error = new Error('You must enter card type, expiring mount, expiring year, card number and card owner name');
        error.status = 400;
        next(error);
    } else if(exMounth.length < 1 || exMounth > 12){
        var error = new Error(`Ex. mount ${exMounth} is not valid. Please enter another one.`);
        error.status = 400;
        next(error);
    } else if(exYear.length < 4 || exYear < 2019) {
        var error = new Error(`Ex. year ${exYear} is not valid. Please enter another one.`);
        error.status = 400;
        next(error);
    }       
    else if(cardNumber.toString().length < 16){
        var error = new Error('Your card number must be at least 16 characters long.');
        error.status = 400;
        next(error);
    } 
    else if(cardNumbersExist == true){
        var error = new Error('That card number is already in use.');
        error.status = 400;
        next(error);
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

insertMoney = async(req, res, next) => {
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


    if(cardNumber == null || amount == null){
        var error = new Error('Please enter card number and how much money you want to add.');
        error.status = 400;
        next(error);
    }
    else if(cardNumber.length < 16){
        var error = new Error(`Card number ${cardNumber}, is not valid.`);
        error.status = 400;
        next(error);
    } 
    else if(cardNumbersExist == false) {
        var error = new Error(`Card number ${cardNumber}, does not exist.`);
        error.status = 400;
        next(error);
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
buyTicket = async(req, res, next) => {
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

    if(userCreditCard == null || ticketAmount == null) {
        var error = new Error('Please enter user credit card and ticket amount.');
        error.status = 400;
        next(error);
    } 
    else if(ticketExist == false) {
        var error = new Error(`Ticket with ID of ${ticketId}, does not exist.`);
        error.status = 400;
        next(error);
    } 
    else if(userExist == false) {
        var error = new Error(`User with ID of ${userId}, does not exist.`);
        error.status = 400;
        next(error);
    } 
    else if(cardNumberExist == false) {
        var error = new Error(`Card with number of ${userCreditCard}, does not exist.`);
        error.status = 400;
        next(error);
    } 
    else if(availableTicketAmount < 0) {
        var error = new Error('No tickets are available.');
        error.status = 400;
        next(error);
    } 
    else if(totalTicketPrice > finalMoneyBalance) {
        var error = new Error('You don\'t have enough money to purchase that.');
        error.status = 400;
        next(error);
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

deleteCard = async(req, res, next) => {
    const cardId = req.params.cardId;

    const cardIds = await queries.getOnlyCardId();
    const cardIdsExist = cardIds.some(card => {
        return cardId == card.Id
    })

    if(cardIdsExist == false) {
        var error = new Error(`Card with ID ${cardId}, has not been found.`);
        error.status = 400;
        next(error);
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
adminGelAllCards = async(req, res, next) => {
    const adminId = req.params.adminId;

    const userTypes = await userQueries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;

    if(checkUserType == "client"){
        var error = new Error(`User with ID if ${adminId}, does not have permissions to do that.`);
        error.status = 400;
        next(error);
    } else {
        try {
            const cards = await queries.adminGetAllCardsQuery();
            res.status(200).json({
                cards
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};
getOneCard = async(req, res, next) => {
    const userId = req.params.userId;

    const users = await userQueries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    const cards = await queries.adminGetAllCardsQuery();
    const cardExist = cards.some(card => {
        return userId == card.User_id
    });
    
    if(userExist == false) {
        var error = new Error(`User with the ID of ${userId}, has not been found.`);
        error.status = 400;
        next(error);
    } else if(cardExist == false){
        var error = new Error(`User with ID if ${userId}, does not have registered card.`);
        error.status = 400;
        next(error);
    } 
    else {
        try {
            const card = await queries.getOneCardQuery(userId);
            res.status(200).json({
                card
            });
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