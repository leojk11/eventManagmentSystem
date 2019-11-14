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
    getAllEventsQuery
}
