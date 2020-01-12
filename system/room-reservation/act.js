const queries = require('./query');
const eventQueires = require('../eventi/query');
const roomQueries = require('../event-rooms/query');
const cardQueires = require('../credit-cards/query');
const userQueries = require('../users/query');

makeReservations = async(req, res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    const cardNumber = req.body.Card_number;
    const roomName = req.body.Room_name;
    const hours = req.body.Hours;

    // reservation date
    const day = req.body.Day;
    const mounth = req.body.Mounth;
    const year = req.body.Year;
    const finalDate = year + '-' + mounth + '-' + day;
    // reservation date

    const getUserMoney = await cardQueires.getMoneyBalance(userId);
    const getRoomInfo = await queries.getSingleRoomByNameQuery(roomName);
    const getCardNumbers = await cardQueires.getOnlyCardNumber();
    const users = await userQueries.getAllUsersQuery();

    
    const roomNameExists = getRoomInfo.some(room => {
        return roomName == room.Room_name
    })
    const cardExists = getCardNumbers.some(card => {
        return cardNumber == card.Card_number
    })
    const userExists = users.some(user => {
        return userId == user.Id
    })

    if(userExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        });
    } else if(cardExists == false) {
        res.status(400).json({
            success: false,
            message: `Card with number of ${cardNumber}, does not exists. Please register it first.`
        });
    } else if (roomNameExists == false) {
        res.status(400).json({
            success: false,
            message: `Room with name of ${roomName}, does not exist.`
        });
    }
    else {
        try {
            const getRoomIdFinal = getRoomInfo[0].Id;
            const getRoomPricePerHour = getRoomInfo[0].Price_per_hour;
            const moneyBalance = getUserMoney[0].Money;

            const hoursReservationFinalPrice = hours * getRoomPricePerHour;
            const reservedForHours = moneyBalance - hoursReservationFinalPrice;

            if(moneyBalance < hoursReservationFinalPrice) {
                res.status(400).json({
                    success: false,
                    message: 'Your dont have enough money to make that reservation'
                });
            } else {
                const updateMoney = await cardQueires.insertMoneyQuery(reservedForHours, userId);
                const madeReservation = await queries.makeReservationQuery(finalDate, getRoomIdFinal, eventId, userId);
                const finalCall = [updateMoney, madeReservation]

                await finalCall;
                res.status(200).json({
                    message: `Reservation for event ${eventId}, in room ${roomName} has been made. Total price is ${hoursReservationFinalPrice}`
                })
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

adminEditReservation = async(req, res) => {
    const adminId = req.params.adminId;
    const reservationId = req.params.resId;

    
    try {
        
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

getMyReservations = async(req, res) => {
    const userId = req.params.userId;

    try {
        const reservations = await queries.getMyReservationsQuery(userId);
        res.status(200).json({
            reservations
        })
    } catch (error) {
        res.status(500).send(erro.message);
    }
}

module.exports = {
    getAllReservations,
    makeReservations,
    getMyReservations
}