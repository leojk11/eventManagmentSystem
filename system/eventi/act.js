const queries = require('./query');
const userQueries = require('../users/query');
const roomsQueires = require('../event-rooms/query');


// CREATE EVENT
createEvent = async(req, res) => {
    const title = req.body.Title;
    const shortInfo = req.body.Short_info;
    const host = req.body.Host;

    const userId = req.params.userId;

    const users = await userQueires.adminGetOneUserQuery(userId);
    const userExists = users.some(user => {
        return userId == user.Id
    })

    if(userExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID if ${userId}, has not been found`
        })
    } else {
        try {
            await queries.createEventQuery(title, shortInfo, host, userId);
            res.status(200).json({
                message: 'Event has been created.'
            })
        } catch (error) {
            // console.log(error);
            res.status(500).send(error);
        }
    }
};

// ADD DETAILS
addDetails = async(req, res) => {
    const eventId = req.params.eventId;
    const startTime = req.body.Start_time;
    const endTime = req.body.End_time;
    const date = req.body.Date;
    const ticketPrice = req.body.Ticket_price;
    const availableTickets = req.body.Available_tickets;
    const eventRoom = req.body.Event_room;

    const events = await userQueries.adminGetOneUserQuery(eventId);
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    const rooms = await roomsQueires.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return eventRoom == room.Id
    })

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not been found.`
        })
    } else if(roomExists == false) {
        res.status(400).json({
            success: false,
            message: `Room with the number of ${eventRoom}, does not exist.`
        })
    } else if(startTime == "" || endTime == "" || date == "" || ticketPrice == "" || eventRoom == "") {
        res.status(400).json({
            success: false,
            message: 'You must enter start time, end time, date, ticket price and event room number.'
        })
    } else {
        try {
            await queries.addEventDetailsQuery(startTime, endTime, date, ticketPrice, availableTickets, eventRoom, eventId);
            res.status(200).json({
                message: 'Event details have been updated.'
            })
        } catch (error) {
            res.status(500).send(error);
        }
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
    });

    const rooms = await roomsQueires.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return eventRoom == room.Id
    })
    
    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not been found.`
        })
    } else if(roomExists == false) {
        res.status(400).json({
            success: false,
            message: `Room with number of ${eventRoom}, does not exist.`
        })
    } 
    else {
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
        const eventsAndDetails = await queries.getAllEventsAndDetailsQuery();
        res.status(200).json({
            eventsAndDetails
        })
    } catch (error) {
        res.status(500).send(error);
    }
};
getEventById = async(req, res) => {
    const eventId = req.params.eventId;

    const events = await queries.getAllEventsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Id
    })

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not been found`
        })
    } else {
        try {
            const event = await queries.getEventByIdQuery(eventId);
            res.status(200).json({
                event
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
};
getEventAndTickets = async(req, res) => {
    const eventId = req.params.eventId;

    const events = await queries.getAllEventsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not bee found.`
        });
    } else {
        try {
            const eventAndTickets = await queries.getEventAndTickets(eventId);
            res.status(200).json({
                eventAndTickets
            })
        } catch (error) {
            res.status(400).send(error);
        }
    }
};


adminDeleteEvent = async(req, res) => {
    const eventId = req.params.eventId;

    const events = await queries.getAllEventsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, has not been found.`
        })
    } else {
        try {
            await queries.adminDeleteEventQuery(eventId);
            res.status(200).json({
                message: `Event with ID of ${eventId}, has been deleted.`
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};



module.exports = {
    createEvent,
    addDetails,
    updateDetails,
    adminDeleteEvent,
    getAllEvents,
    getAllEventsAndDetails,
    getEventById,
    getEventAndTickets
}