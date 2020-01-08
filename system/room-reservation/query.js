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

makeReservationQuery = (finalDate, testRoomId, testEventId, testUserId) => {
     const query = "INSERT INTO room_reservation(Date, Room_id, Event_id, User_id) VALUES (?,?,?,?)"
     return new Promise((res, rej) => {
         connection.query(query, [finalDate, testRoomId, testEventId, testUserId], (error, results, fields) => {
             if(error){
                 rej(error)
             } else {
                 res(results)
             }
         });
     });
};

getMyReservationsQuery = (userId) => {
    const query = "SELECT * FROM room_reservation WHERE User_id = ?";
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
    getAllReservationsQuery,
    getSingleRoomByNameQuery,
    makeReservationQuery,
    getMyReservationsQuery
}