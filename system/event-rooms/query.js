const connection = require('../../DB/database');

adminCreateRoomsQuery = (roomName, equipAvailable, roomCapacity, roomStatus, roomPrice) => {
    const query = "INSERT INTO event_rooms(Room_name, Equipement_available, Room_capacity, Status, Price) VALUES(?,?,?,?,?)";
    return new Promise((res, rej) => {
        connection.query(query, [roomName, equipAvailable, roomCapacity, roomStatus, roomPrice], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getAllRoomsQuery = () => {
    const query = "SELECT * FROM event_rooms";
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
getSingleRoomQuery = (roomId) => {
    const query = "SELECT * FROM event_rooms WHERE Id = ?";
    return new Promise((res, rej) => {
        connection.query(query, [roomId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

adminDeleteRoomQuery = (roomId) => {
    console.log(roomId)
    const query = "DELETE FROM event_rooms WHERE Id = ?";
    return new Promise((res, rej) => {
        connection.query(query, [roomId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

adminEditRoomInfoQuery = (roomId) => {
    const query = "UPDATE event_rooms SET Room_name = ?, Equipement_available = ?, Room_capacity = ?, Status = ?, Price = ? WHERE Id = ?";
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
    adminCreateRoomsQuery,
    getAllRoomsQuery,
    getSingleRoomQuery,
    adminDeleteRoomQuery,
    adminEditRoomInfoQuery
}