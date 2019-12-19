const queries = require('./query');
const userQueries = require('../users/query');
const eventQueries = require('../eventi/query');


createTicket = async(req, res) => {
    const price = req.body.Price;
    const availableAm = req.body.Available_amount;
    const eventInfo = req.body.Event_info;
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    const user = await userQueries.getAllUsersQuery();
    const userExists = user.some(user => {
        return userId == user.Id
    });

    const event = await eventQueries.getAllEventsQuery();
    const eventExists = event.some(event => {
        return eventId == event.Id
    });

    if(userExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID if ${userId}, does not exist.`
        });
    } 
    else if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not exist.`
        });
    }
    else if(eventInfo == null || availableAm == null || price == null) {
        res.status(400).json({
            success: false,
            message: 'All fields need to be filled with information.'
        });
    } 
    else {
        try {
            await queries.createTicketQuery(price, availableAm, eventInfo, eventId, userId);
            res.status(200).json({
                message: `Ticket for event ${eventId}, has been created.`
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

getAllAvailableTickets = async(req, res) => {
    try {
        const availableTickets = await queries.getAllAvailableTicketsQuery();
        res.status(200).json({
            availableTickets
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

getMyTickets = async(req, res) => {
    const userId = req.params.userId;

    const users = await userQueries.getAllUsersQuery();
    const userExists = users.some(user => {
        return userId == user.Id
    });

    const tickets = await queries.getAllTicketsQuery();
    const userTicketExists = tickets.some(user => {
        return userId == user.User_id
    });

    if(userExists == false){
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        });
    } else if(userTicketExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not have any tickes`
        });
    } 
    else {
        try {
            const myTickets = await queries.getUserInfoAndTicketsQuery(userId);
            const ticketInfo = myTickets.map(info => {
                const ticketsObj = {
                    eventInfo: info.Event_info,
                    availableAmount: info.Available_amount,
                    price: info.Price,
                    eventId: info.Event_id
                }
                return ticketsObj;
            })
            res.status(200).json({
                userInfo: {
                    id: myTickets[0].User_id,
                    firstname: myTickets[0].Name,
                    lastname: myTickets[0].Lastname,
                    username: myTickets[0].Username,
                    email: myTickets[0].Email,
                    tickets: ticketInfo
                },
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};


getAllTickets = async(req, res) => {
    try {
        const tickets = await queries.getAllTicketsQuery();
        res.status(200).json({
            tickets
        });
    } catch (error) {
        res.status(500).send(error.message);   
    }
};

getOnlyOneTicket = async(req, res) => {
    const eventId = req.params.eventId;

    const events = await eventQueries.getEventByIdQuery(eventId);
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    const tickets = await queries.getOnlyOneTicketQuery(eventId);
    const eventTicketsExists = tickets.some(ticket => {
        return eventId == ticket.Event_id
    });

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not exist.`
        });
    } 
    else if (eventTicketsExists == false){
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not have any tickets.`
        });
    } else {
        try {
            const ticket = await queries.getOnlyOneTicketQuery(eventId);
            res.status(200).json({
                ticket
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = {
    createTicket,
    getAllAvailableTickets,
    getMyTickets,
    getAllTickets,
    getOnlyOneTicket
}