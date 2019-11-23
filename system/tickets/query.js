const connection = require('../../DB/database');

createTicketQuery = (price, availbaleAm, eventInfo, eventId, userId) => {
    const query = "INSERT INTO tickets(Price, Available_amount, Event_info, User_id, Event_id) VALUES (?,?,?,?,?)";
    return new Promise((res, rej) => {
        connection.query(query,[price, availbaleAm, eventInfo, eventId, userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

// ADMIN
adminGetAllTicketsQuery = () => {
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
adminGetOnlyOneTicketQuery = (eventId) => {
    const query = "SELECT * FROM tickets WHERE Id = ?";
    return new Promise((res, rej) => {
        connection.query(query, [eventId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

module.exports = {
    createTicketQuery,
    adminGetAllTicketsQuery,
    adminGetOnlyOneTicketQuery
}