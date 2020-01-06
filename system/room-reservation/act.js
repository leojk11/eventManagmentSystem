const queries = require('./query');
const eventQueires = require('../eventi/query');

makeReservations = async(req, res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    const cardNumber = req.params.Card_number;

    const roomName = req.body.Room_name;

    const getRoomId = await queries.getOnlyRoomIdQuery(roomName);
    const getRoomIdFinal = getRoomId[0].Id;

    console.log(getRoomIdFinal);    

    

    try {
        await queries.makeReservationQuery(date, getRoomIdFinal, eventId, userId);
        res.status(200).json({
            message: `Reservation for event ${eventId}, in room ${roomName} has been made.`
        })
    } catch (error) {
        res.status(500).json({
            error
        });
    }
}

getAllReservations = async(req, res) => {
    try {
        const reservations = await queries.getAllReservationsQuery();
        res.status(200).json({
            reservations
        })
    } catch (error) {
        res.status(500).json({
            error
        });
    }
}

module.exports = {
    getAllReservations,
    makeReservations
}