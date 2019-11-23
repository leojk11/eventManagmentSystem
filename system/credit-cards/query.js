const connection = require('../../DB/database');

addCardQuery = (cardName, amount, cardNumber, exMounth, exYear, userId) => {
    const query = "INSERT INTO cards(cardName, amount, cardNumber, exMounth, exYear, userId) VALUES (?,?,?,?,?,?)";
    return new Promise((res, rej) => {
        connection.query(query,[cardName, amount, cardNumber, exMounth, exYear, userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(JSON.parse(JSON.stringify(results)))
            }
        });
    });
};

adminGetAllCardsQuery = () => {
    const query = "SELECT * FROM cards";
    return new Promise((res, rej) => {
        connection.query(query, (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getCardNumbersQuery = () => {
    const query = "SELECT cardNumber FROM cards";
    return new Promise((res, rej) => {
        connection.query(query, (error, results, fileds) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getOnlyCardNumber = () => {
    const query = "SELECT cardNumber FROM cards";
    return new Promise((res, rej) => {
        connection.query(query, (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getOnlyCardId = () => {
    const query = "SELECT Id FROM cards";
    return new Promise((res, rej) => {
        connection.query(query, (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

deleteCardQuery = (cardId) => {
    const query = "DELETE FROM cards WHERE Id = ?";
    return new Promise((res, rej) => {
        connection.query(query, cardId, (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

module.exports = {
    addCardQuery,
    getCardNumbersQuery,
    deleteCardQuery,
    getOnlyCardNumber,
    getOnlyCardId,
    adminGetAllCardsQuery
}