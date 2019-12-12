const connection = require('../../DB/database');

createEventQuery = (title, shortInfo, host, userId) => {
    // console.log(userId);
    const query = 'INSERT INTO events(Title, Short_info, Host, User_id) VALUES (?,?,?,?)';
    return new Promise((res, rej) => {
        connection.query(query, [title, shortInfo, host, userId],(error, results, fields)=>{
            if(error){
                rej(error);
                // console.log(error);
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
updateEventDetailsQuery = (startTime, endTime, date, ticketPrice, availableTickets, eventRoom, eventId) => {
    // console.log(startTime)
    const query = "UPDATE event_details SET Start_time = ?, End_time = ?, Date = ?, Ticket_price = ?, Available_ticket = ?, Event_room = ? WHERE Event_id = ?";
    return new Promise((res, rej) => {
        connection.query(query, [startTime, endTime, date, ticketPrice, availableTickets, eventRoom, eventId], (error, results, fields) => {
            if(error) {
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getAllEventsQuery = () => {
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
getAllEventsAndDetailsQuery = () => {
    const query = "SELECT * FROM events LEFT JOIN event_details ON event_details.Event_id = events.Id";
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
getSingleEventAndDetailsQuery = (eventId) => {
    const query = "SELECT * FROM event_details LEFT JOIN events ON event_details.Event_id = events.Id WHERE event_details.Event_id = ?";
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
getEventAndTickets = (eventId) => {
    const query = "SELECT Event_id, Title, Host, Price, Available_amount, Event_info FROM events LEFT JOIN tickets ON tickets.Event_id = events.Id WHERE Event_id = ?";
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
adminGetAllEventDetailsQuery = () => {
    const query = "SELECT Id FROM event_details";
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
    adminDeleteEventQuery,
    adminGetAllEventDetailsQuery,
    createEventQuery,
    addEventDetailsQuery,
    getAllEventsQuery,
    getAllEventsAndDetailsQuery,
    getEventByIdQuery,
    getEventAndTickets,
    getSingleEventAndDetailsQuery,
    updateEventDetailsQuery
}
