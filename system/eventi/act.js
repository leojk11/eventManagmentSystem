const queries = require('./query');


// CREATE EVENT
createEvent = async(req, res) => {
    try {
        const eventInfo = req.body;
        const userId = req.params.userId;

        await queries.createEventQuery(userId, eventInfo);
        res.status(200).json({
            message: 'Event has been created.'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
// ADD DETAILS
addDetails = async(req, res) => {
    const eventId = req.params.eventId;

    const startTime = req.body.Start_time;
    const endTime = req.body.End_time;
    const date = req.body.Date;

    const ticketPrice = req.body.Ticket_price;
    const finalTicketPrice = ticketPrice + "$";

    const availableTickets = req.body.Available_tickets;

    const eventRoom = req.body.Event_room;
    const finalEventRoom = eventRoom + " " + "room";

    try {
        await queries.addEventDetailsQuery(startTime, endTime, date, finalTicketPrice, availableTickets, finalEventRoom, eventId);
        res.status(200).json({
            message: 'Event details have been updated.'
        })
    } catch (error) {
        req.status(500).send(error);
    }
};
// UPDATE DETAILS
updateDetails = async(req, res) => {
    const eventId = req.params.eventId;

    const startTime = req.body.Start_time;
    const endTime = req.body.End_time;
    const date = req.body.Date;
    const ticketPrice = req.body.Ticket_price;
    const availableTickets = req.body.Available_tickets;
    const eventRoom = req.body.Event_room;


    const events = await queries.adminGetAllEventDetailsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Id
    })
    
    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not been found.`
        })
    } else {
        try {
            await queries.updateEventDetailsQuery(startTime, endTime, date, ticketPrice, availableTickets, eventRoom, eventId);

            res.status(200).json({
                message: `Event with the ID of ${eventId}, has been updated!`
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    
};

// GET ALL EVENTS
getAllEvents = async(req, res) => {
    try {
        const events = await queries.getAllEventsQuery();
        res.status(200).json({
            events
        })
    } catch (error) {
        res.status(500).send(error);
    }
};
getAllEventsAndDetails = async(req, res) => {
    try {
        const eventsAndDetails = await queries.getAllEventsAndDetails();
        res.status(200).json({
            eventsAndDetails
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

// ADMIN
adminGetAllEvents = async(req, res) => {
    try {
        const events = await queries.adminGetAllEventsQuery();
        res.status(200).json({
            events
        })
    } catch (error) {
        res.status(500).send(error);
    }
};
adminDeleteEvent = async(req, res) => {
    const eventId = req.params.eventId;
    try {
        await queries.adminDeleteEventQuery(eventId);
        res.status(200).json({
            message: `Event with ID of ${eventId}, has been deleted.`
        })
    } catch (error) {
        res.status(500).send(error);
    }
};



module.exports = {
    createEvent,
    addDetails,
    updateDetails,
    adminDeleteEvent,
    adminGetAllEvents,
    getAllEvents,
    getAllEventsAndDetails
}