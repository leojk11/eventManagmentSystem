const helper = require('../helper/helper');
const queries = require('./query');

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
        return cardNumber == card.cardNumber
    })

    if(cardType.length < 1){
        res.status(400).json({
            success: false,
            message: 'Please enter card type.'
        })
    } else if(moneyAmount.length < 1){
        res.status(400).json({
            success: false,
            message: 'Please enter amount.'
        })
    } else if(exMounth.length < 1){
        res.status(400).json({
            success: false,
            message: 'Please enter expiering mounth.'
        })
    }
    else if(cardNumber.toString().length < 16){
        res.status(400).json({
            success: false,
            message: 'Your card number must be at least 16 characters long.'
        })
    } 
    // else if(cardNumbersExist){
    //     res.status(400).json({
    //         message: 'That card is already in use.'
    //     })
    // } 
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
        return cardNumber == card.cardNumber
    });

    const money = await queries.getOnlyMoneyAmountQuery(userId);
    console.log(money);

    const results = money.map(obj => parseInt(obj.test));
    console.log(results);

    if(!cardNumbersExist) {
        const addedMoney = money.Money + amount;
        console.log(addedMoney);

        try {
            await queries.insertMoneyQuery(addedMoney, userId);
            res.status(200).json({
                message: `${amount}$, have been added.`
            })
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(400).json({
            success: false,
            message: `Card number ${cardNumber}, does not exist.`
        })
    }
    
}

deleteCard = async(req, res) => {
    const cardId = req.params.cardId;

    const cardIds = await queries.getOnlyCardId();
    const cardIdsExist = cardIds.some(card => {
        return cardId == card.Id
    })

    if(cardIdsExist == false) {
        res.status(200).json({
            success: false,
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
}

module.exports = {
    addCard,
    insertMoney,
    deleteCard,
    adminGelAllCards
}