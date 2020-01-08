const queries = require('./query');
const eventQueires = require('../eventi/query');
const roomQueries = require('../event-rooms/query');

makeReservations = async(req, res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    const cardNumber = req.params.Card_number;

    const roomName = req.body.Room_name;

    const getRoomInfo = await queries.getSingleRoomByNameQuery(roomName);
    const getRoomIdFinal = getRoomInfo[0].Id;
    const getRoomPricePerDay = getRoomInfo[0].Price_per_day;
    const getRoomPricePerHour = getRoomInfo[0].Price_per_hour;

    

    try {
        // await queries.makeReservationQuery(cardNumber, eventId, userId);
        res.status(200).json({
            message: `Reservation for event ${eventId}, in room ${roomName} has been made.`
        })
    } catch (error) {
        res.status(500).send(error.message);
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