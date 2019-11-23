const queries = require('./query');

createTicket = async(req, res) => {
    const price = req.body.Price;
    const availableAm = req.body.Available_amount;
    const eventInfo = req.body.Event_info;
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    try {
        await queries.createTicketQuery(price, availableAm, eventInfo, eventId, userId);
        res.status(200).json({
            message: `Ticket for event ${eventId}, has been created.`
        })
    } catch (error) {
        res.status(500).send(error);
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
    adminGetAllTickets,
    adminGetOnlyOneTicket
}