const connection = require('../../DB/database');

createTicketQuery = (price, availbaleAm, eventInfo, eventId, userId) => {
    const query = "INSERT INTO tickets(Price, Available_amount, Event_info, User_id, Event_id) VALUES (?,?,?,?,?)";
    return new Promise((res, rej) => {
        connection.query(query,[price, availbaleAm, eventInfo, userId, eventId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};
getAllAvailableTicketsQuery = () => {
    const query = "SELECT * FROM tickets WHERE Available_amount > 0";
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
getMyTicketsQuery = (userId) => {
    const query = "SELECT * FROM tickets WHERE User_id = ?";
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
getOnlyOneTicketQuery = (eventId) => {
    const query = "SELECT * FROM tickets WHERE Event_id = ?";
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
getUserInfoAndTicketsQuery = (userId) => {
    const query = "SELECT * FROM users LEFT JOIN tickets ON tickets.User_id = users.Id WHERE users.Id = ?";
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

module.exports = {
    createTicketQuery,
    getAllAvailableTicketsQuery,
    getMyTicketsQuery,
    getAllTicketsQuery,
    getOnlyOneTicketQuery,
    getUserInfoAndTicketsQuery
}