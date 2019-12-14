const queries = require('./query');
const userQueries = require('../users/query');

adminCreateRooms = async(req, res, next) => {
    const adminId = req.params.adminId;

    const roomName = req.body.Room_name;
    const equipAvailable = req.body.Equipement_available;
    const roomCapacity = req.body.Room_capacity;

    const userTypes = await userQueries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;
    
    if(checkUserType == "client"){
        var error = new Error(`User with ID if ${adminId}, does not have permissions to do that.`);
        error.status = 400;
        next(error);
    } else if(roomName == null || equipAvailable == null || roomCapacity == null){
        var error = new Error('You must enter room name, equipement available, room capacity.');
        error.status = 400;
        next(error);
    } else {
        try {
            await queries.adminCreateRoomsQuery(roomName, equipAvailable, roomCapacity);
            res.status(200).json({
                message: 'Room has been created.'
            })
        } catch (error) {
            res.status(500).send(error);
        }
    };
};

adminDeleteRooms = async(req, res, next) => {
    const adminId = req.params.adminId;
    const roomId = req.params.roomId;

    const userTypes = await userQueries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;

    const rooms = await queries.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return roomId == room.Id
    })

    if(checkUserType == "client"){
        var error = new Error(`User with ID of ${adminId}, does not have permissions do to that.`);
        error.status = 400;
        next(error);
    } else if(roomExists == false) {
        var error = new Error(`Room with ID of ${roomId}, has not been found.`);
        error.status = 400;
        next(error);
    } else {
        try {
            await queries.adminDeleteRoomQuery(roomId);
            res.status(200).json({
                message: `Room with ID of ${roomId}, has been deleted.`
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

getAllRooms = async(req, res) => {
    try {
        const rooms = await queries.getAllRoomsQuery();
        res.status(200).json({
            rooms
        })
    } catch (error) {
        res.status(500).send(error);
        // console.log(error);
    }
};

getSingleRoom = async(req, res, next) => {
    const roomId = req.params.roomId;

    const rooms = await queries.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return roomId == room.Id
    })

    if(roomExists == false) {
        var error = new Error(`Room with ID of ${roomId}, has not been found.`);
        error.status = 400;
        next(error);
    } else {
        try {
            const singleRoom = await queries.getSingleRoomQuery(roomId);
            res.status(200).json({
                singleRoom
            });
        } catch (error) {
            res.status(500).send(error);
            // console.log(error);
        }
    }
};

module.exports = {
    adminCreateRooms,
    getAllRooms,
    getSingleRoom,
    adminDeleteRooms
}