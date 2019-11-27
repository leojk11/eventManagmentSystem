const connection = require('../../DB/database');

function createEventQuery(userId, event) {
    console.log(userId);
    const query = 'INSERT INTO events(Title, Short_info, Host, User_id) VALUES (?,?,?,?)';
    return new Promise((res, rej) => {
        connection.query(query, [event.Title, event.Short_info, event.Host, userId],(error, results, fields)=>{
            if(error){
                rej(error);
                console.log(error);
            } else {
                res(results)
            }
        });
    });
};
addEventDetailsQuery = (startTime, endTime, date, ticketPrice, availableTickets, eventRoom, eventId) => {
    const query = "INSERT INTO event_details(Start_time, End_time, Date, Ticket_price, Available_ticket, Event_room, Event_id) VALUES(?,?,?,?,?,?,?)";
    return new Promise((res, rej) => {
        connection.query(query, [startTime, endTime, date, ticketPrice, availableTickets, eventRoom, eventId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};
updateEventDetailsQuery = () => {
    const query = "UPDATE event_details SET Start_time = ?, End_time = ?, Date = ?, Ticket_price = ?, Available_ticket = ?, Event_room = ?, Event_id = ? WHERE Id = ?";
    return new Promise((res, rej) => {
        connection.query(query, [], (error, results, fields) => {
            if(error) {
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getAllEventsQuery = () => {
    const query = "SELECT Title, Short_info, Host FROM events";
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
getEventByIdQuery = (eventId) => {
    const query = "SELECT * FROM events WHERE Id = ?";
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


// ADMIN
adminGetAllEventsQuery = () => {
    const query = "SELECT * FROM events";
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
adminDeleteEventQuery = (eventId) => {
    const query = "DELETE FROM events WHERE Id = ?";
    return new Promise((res, rej)=> {
        connection.query(query,[eventId],(error, results, fields) => {
            if(error){
                rej(error);
            } else {
                res(results);
            }
        });
    });
};


module.exports = {
    adminGetAllEventsQuery,
    adminDeleteEventQuery,
    createEventQuery,
    addEventDetailsQuery,
    getAllEventsQuery,
    getEventByIdQuery
}
