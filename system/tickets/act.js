const queries = require('./query');
const userQueries = require('../users/query');
const eventQueries = require('../eventi/query');


createTicket = async(req, res) => {
    const price = req.body.Price;
    const availableAm = req.body.Available_amount;
    const eventInfo = req.body.Event_info;
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    const user = await userQueries.adminGetOneUserQuery(userId);
    const userExists = user.some(user => {
        return userId == user.Id
    });

    const event = await eventQueries.getEventByIdQuery(eventId);
    const eventExists = event.some(event => {
        return eventId == event.Id
    })

    if(userExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, has not been found.`
        })
    } else if(eventExists == false) {
        res.statusn(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not been found.`
        })
    } 
    else {
        try {
            await queries.createTicketQuery(price, availableAm, eventInfo, eventId, userId);
            res.status(200).json({
                message: `Ticket for event ${eventId}, has been created.`
            })
        } catch (error) {
            res.status(500).send(error);
        }
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

    const tickets = await queries.adminGetAllTicketsQuery();
    const userTicketExists = tickets.some(user => {
        return userId == user.User_id
    })

    if(userExists == false){
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        })
    } else if(userTicketExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not have any tickets.`
        })
    } 
    else {
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

    const events = await eventQueries.getEventByIdQuery(eventId);
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    const tickets = await queries.adminGetOnlyOneTicketQuery(eventId);
    const eventTicketsExists = tickets.some(ticket => {
        return eventId == ticket.Event_id
    });

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not been found.`
        });
    } else if (eventTicketsExists == false){
        res.status(400).jso({
            success: false,
            message: `Event with ID of ${eventId}, does not have any tickets.`
        });
    } else {
        try {
            const ticket = await queries.adminGetOnlyOneTicketQuery(eventId);
            res.status(200).json({
                ticket
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = {
    createTicket,
    getAllAvailableTickets,
    getMyTickets,
    adminGetAllTickets,
    adminGetOnlyOneTicket
}