const queries = require('./query');
const userQueries = require('../users/query');

createTicket = async(req, res) => {
    const price = req.body.Price;
    const finalPrice = price + "$";
    const availableAm = req.body.Available_amount;
    const eventInfo = req.body.Event_info;
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    try {
        await queries.createTicketQuery(finalPrice, availableAm, eventInfo, eventId, userId);
        res.status(200).json({
            message: `Ticket for event ${eventId}, has been created.`
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

getAllAvailableTickets = async(req, res) => {
    try {
        const availableTickets = await queries.getAllAvailableTicketsQuery();
        res.status(200).json({
            availableTickets
        })
    } catch (error) {
        res.status(500).send(error);
    }
};
getMyTickets = async(req, res) => {
    const userId = req.params.userId;

    const users = await userQueries.getAllUsersQuery();
    const userExists = users.some(user => {
        return userId == user.Id
    });

    if(userExists == false){
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        })
    } else {
        try {
            const myTickets = await queries.getMyTicketsQuery(userId);
            res.status(200).json({
                myTickets
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
};
// ADMIN
adminGetAllTickets = async(req, res) => {
    try {
        const tickets = await queries.adminGetAllTicketsQuery();
        res.status(200).json({
            tickets
        })
    } catch (error) {
        res.status(500).send(error);   
    }
};
adminGetOnlyOneTicket = async(req, res) => {
    const eventId = req.params.eventId;

    try {
        const ticket = await queries.adminGetOnlyOneTicketQuery(eventId);
        res.status(200).json({
            ticket
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    createTicket,
    getAllAvailableTickets,
    getMyTickets,
    adminGetAllTickets,
    adminGetOnlyOneTicket
}