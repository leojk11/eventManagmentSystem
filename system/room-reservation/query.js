const connection = require('../../DB/database');

getAllReservationsQuery = () => {
    const query = "SELECT * FROM room_reservation";
    return new Promise((res, rej) => {
        connection.query(query, (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        })
    })
};

getSingleRoomByNameQuery = (eventName) => {
    const query = "SELECT * FROM event_rooms WHERE Room_name = ?";
    return new Promise((res, rej) => {
        connection.query(query, [eventName], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

makeReservationQuery = () => {
     const query = "INSERT INTO room_reservation(Date, Room_id, Event_id, User_id) VALUES (?,?,?,?)"
     return new Promise((res, rej) => {
         connection.query(query, [], (error, results, fields) => {
             if(error){
                 rej(error)
             } else {
                 res(results)
             }
         });
     });
};

module.exports = {
    getAllReservationsQuery,
    getSingleRoomByNameQuery,
    makeReservationQuery
}