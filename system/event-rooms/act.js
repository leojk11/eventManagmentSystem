const queries = require('./query');
const userQueries = require('../users/query');

adminCreateRooms = async(req, res, next) => {
    const adminId = req.params.adminId;

    const roomName = req.body.Room_name;
    const equipAvailable = req.body.Equipement_available;
    const roomCapacity = req.body.Room_capacity;
    const roomPrice = req.body.Room_price;
    const roomStatus = req.body.Status;

    const userTypes = await userQueries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;
    
    if(checkUserType == "client"){
        res.status(400).json({
            success: false,
            message: `User with ID of ${adminId}, does not have permissions to create rooms.`
        });
    } else if(roomName == null || equipAvailable == null || roomCapacity == null || roomPrice == null || roomStatus == null){
        res.status(400).json({
            success: false,
            message: 'You have to enter room name, equipement available, room capacity, room status and room price.'
        });
    } else {
        try {
            await queries.adminCreateRoomsQuery(roomName, equipAvailable, roomCapacity, roomStatus, roomPrice);
            res.status(200).json({
                message: 'Room has been created.'
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    };
};

adminEditRoomInfo= async(req, res) => {
    const adminId = req.params.adminId;
    const roomId = req.params.roomId;

    const roomName = req.body.Room_name;
    const equipAvailable = req.body.Equipement_available;
    const roomCapacity = req.body.Room_capacity;
    const roomPrice = req.body.Price;
    const roomStatus = req.body.Status;

    const users = await userQueries.adminGetOneUserQuery(adminId);
    const userExists = users.some(user => {
        return adminId == user.Id;
    })

    const rooms = await queries.getSingleRoomQuery(roomId);
    const roomExists = rooms.some(room => {
        return roomId == room.Id;
    });

    const admin = 'admin';
    const checkIfAdmin = await userQueries.adminGetOneUserQuery(adminId);
    const adminExist = checkIfAdmin.some(user => {
        return admin == user.User_type;
    });

    const uneditedRoomInfo = rooms.filter(room => {
        if(roomName == null) {
            roomName == room.Room_name
        } else {
            room.Room_name == roomName
        }

        if(equipAvailable == null) {
            equipAvailable == room.Equipement_available
        } else {
            room.Equipement_available == equipAvailable
        }

        if(roomCapacity == null) {
            roomCapacity == room.Room_capacity
        } else {
            room.Room_capacity == roomCapacity
        }

        if(roomPrice == null) {
            roomPrice == room.Price
        } else {
            room.Price == roomPrice
        }

        if(roomStatus == null) {
            roomStatus == room.Status
        } else {
            room.Status == roomStatus
        }

        return room;
    });

    const editedRoomInfo = uneditedRoomInfo[0];

    if(userExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${adminId}, does not exist.`
        })
    } else if(adminExist == false) {
        res.status(400).json({
            succees: false,
            message: `User with ID of ${adminId}, does not have permissions to do that.`
        })
    } else if (roomExists == false) {
        res.status(400).json({
            success: false,
            message: `Room with ID of ${roomId}, does not eixst.`
        })
    } 
    else {
        try {
            await queries.adminEditRoomInfoQuery(editedRoomInfo.Room_name, editedRoomInfo.Equipement_available, editedRoomInfo.Room_capacity, editedRoomInfo.Status, editedRoomInfo.Price, roomId);
            res.status(200).json({
                message: `Room with ID of ${roomId}, has been edited.`
            })
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

adminDeleteRooms = async(req, res, next) => {
    const adminId = req.params.adminId;
    const roomId = req.params.roomId;

    const userTypes = await userQueries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;

    const rooms = await queries.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return roomId == room.Id
    });

    if(checkUserType == "client"){
        res.status(400).json({
            success: false,
            message: `User with ID of ${adminId}, does not have permissions to do that.`
        });
    } else if(roomExists == false) {
        res.status(400).json({
            success: false,
            message: `Room with ID of ${roomId}, does not exist.`
        });
    } else {
        try {
            await queries.adminDeleteRoomQuery(roomId);
            res.status(200).json({
                message: `Room with ID of ${roomId}, has been deleted.`
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

getAllRooms = async(req, res) => {
    try {
        const rooms = await queries.getAllRoomsQuery();
        res.status(200).json({
            rooms
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

getSingleRoom = async(req, res, next) => {
    const roomId = req.params.roomId;

    const rooms = await queries.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return roomId == room.Id
    });

    if(roomExists == false) {
        res.status(400).json({
            success: false,
            message: `Roo wiht ID of ${roomId}, does not exist.`
        });
    } else {
        try {
            const singleRoom = await queries.getSingleRoomQuery(roomId);
            res.status(200).json({
                singleRoom
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = {
    adminCreateRooms,
    getAllRooms,
    getSingleRoom,
    adminDeleteRooms,
    adminEditRoomInfo
}