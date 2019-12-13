const queries = require('./query');

adminCreateRooms = async(req, res) => {
    const roomName = req.body.Room_name;
    const equipAvailable = req.body.Equipement_available;
    const roomCapacity = req.body.Room_capacity;
    
    if(roomName == "" || equipAvailable == "" || roomCapacity == ""){
        res.status(400).json({
            message: 'You must enter room name, equipement available, room capacity.'
        })
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

adminDeleteRooms = async(req, res) => {
    const roomId = req.params.roomId;

    const rooms = await queries.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return roomId == room.Id
    })

    if(roomExists == false) {
        res.status(400).json({
            message: `Room with ID of ${roomId}, has not been found.`
        })
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

getSingleRoom = async(req, res) => {
    const roomId = req.params.roomId;

    const rooms = await queries.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return roomId == room.Id
    })

    if(roomExists == false) {
        res.status(400).json({
            message: `Room with ID of ${roomId}, has not been found.`
        })
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