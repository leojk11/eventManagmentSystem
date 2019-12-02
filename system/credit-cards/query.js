const connection = require('../../DB/database');

addCardQuery = (cardType, exMounth, exYear, cardNumber, cardOwnerName, moneyAmount, userId) => {
    const query = "INSERT INTO payment_details(Card_type, Ex_mounth, Ex_year, Card_number, Card_owner_name, Money, User_id) VALUES (?,?,?,?,?,?,?)";
    return new Promise((res, rej) => {
        connection.query(query,[cardType, exMounth, exYear, cardNumber, cardOwnerName, moneyAmount, userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(JSON.parse(JSON.stringify(results)))
            }
        });
    });
};

getOneCardQuery = (userId) => {
    const query = "SELECT * FROM payment_details WHERE User_id = 1";
    return new Promise((res, rej) => {
        connection.query(query, [userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getCardNumbersQuery = () => {
    const query = "SELECT Card_number FROM payment_details";
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
    const query = "SELECT Card_number FROM payment_details";
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
    const query = "SELECT Id FROM payment_details";
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

getOnlyMoneyAmountQuery = (userId) => {
    const query = "SELECT Money FROM payment_details";
    return new Promise((res, rej) => {
        connection.query(query, [userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(JSON.parse(JSON.stringify(results)))
            }
        });
    });
};

deleteCardQuery = (cardId) => {
    const query = "DELETE FROM payment_details WHERE Id = ?";
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

insertMoneyQuery = (moneyAmount, userId) => {
    const query = "UPDATE payment_details SET Money = ? WHERE User_id = ?";
    return new Promise((res, rej) => {
        connection.query(query, [moneyAmount, userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getAllTicketsQuery = () => {
    const query = "SELECT * FROM tickets";
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

// ADMIN
adminGetAllCardsQuery = () => {
    const query = "SELECT * FROM payment_details";
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

module.exports = {
    addCardQuery,
    insertMoneyQuery,
    getCardNumbersQuery,
    deleteCardQuery,
    getOnlyCardNumber,
    getOnlyCardId,
    getOnlyMoneyAmountQuery,
    getOneCardQuery,
    adminGetAllCardsQuery,
    getAllTicketsQuery
}