const queries = require('./query');
const userQueries = require('../users/query');
const roomsQueires = require('../event-rooms/query');
const ticketQueries = require('../tickets/query');


// CREATE EVENT
createEvent = async(req, res) => {
    const title = req.body.Title;
    const shortInfo = req.body.Short_info;
    const host = req.body.Host;

    const userId = req.params.userId;

    const users = await userQueries.adminGetOneUserQuery(userId);
    const userExists = users.some(user => {
        return userId == user.Id
    });

    if(userExists == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        });
    } else if(title == null || shortInfo == null || host == null) {
        res.status(400).json({
            success: false,
            message: 'You have to enter event title, short info about your event and who is the host.'
        });
    } 
    else {
        try {
            await queries.createEventQuery(title, shortInfo, host, userId);
            res.status(200).json({
                message: 'Event has been created.'
            });
        } catch (error) {
            res.status(500).send(error.message);
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

    const events = await queries.getAllEventsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    const rooms = await roomsQueires.getAllRoomsQuery();
    const roomExists = rooms.some(room => {
        return eventRoom == room.Id
    });

    const eventDetails = await queries.getAllDetailsQuery();
    const eventDetailsExist = eventDetails.some(details => {
        return eventId == details.Event_id
    });

    if(eventDetailsExist == true) {
        res.status(400).json({
            success: false,
            message: `Details for event with ID of ${eventId}, already exist.`
        });
    } 
    else if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not exist.`
        });
    } 
    else if(roomExists == false) {
        res.status(400).json({
            success: false,
            message: `Room with number of ${eventRoom}, does not exist.`
        });
    } 
    else if(startTime == null || endTime == null || date == null || ticketPrice == null || eventRoom == null) {
        res.status(400).json({
            success: false,
            message: 'All fields need to be filled.'
        });
    } 
    else {
        try {
            await queries.addEventDetailsQuery(startTime, endTime, date, ticketPrice, availableTickets, eventRoom, eventId);
            res.status(200).json({
                message: 'Event details have been updated.'
            });
        } catch (error) {
            res.status(500).send(error.message);
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

    const events = await queries.getAllEventsAndDetailsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Event_id
    });

    const eventToUpd = events.filter(event => {
        if(startTime == null){
            startTime == event.Start_time
        } else {
            event.Start_time = startTime
        }

        if(endTime == null){
            endTime == event.End_time
        } else {
            event.End_time = endTime
        }

        if(date == null){
            date == event.Date
        } else {
            event.Date == date
        }

        if(ticketPrice == null){
            ticketPrice == event.Ticket_price
        } else {
            event.Ticket_price = ticketPrice
        }

        if(eventRoom == null){
            eventRoom == event.Event_room
        } else {
            event.Event_room = eventRoom
        }
        return event
    });
    const finalResults = eventToUpd[0];
    // console.log(finalResults.Ticket_price);

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not exist.`
        });
    } 
    else if(availableTickets == null){
        res.status(400).json({
            success: false,
            message: 'Available tickets field cannot be null.'
        });
    } 
    else {
        try {
            await queries.updateEventDetailsQuery(finalResults.Start_time, finalResults.End_time, finalResults.Date, finalResults.Ticket_price, availableTickets, finalResults.Event_room, eventId);

            res.status(200).json({
                message: `Event with the ID of ${eventId}, has been updated!`
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    
};

// GET ALL EVENTS
getAllEvents = async(req, res) => {
    try {
        const events = await queries.getAllEventsQuery();
        res.status(200).json({
            events
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
getAllEventsAndDetails = async(req, res) => {
    try {
        const eventsAndDetails = await queries.getAllEventsAndDetailsQuery();
        const events = eventsAndDetails.map(events => {
            const eventObj = {
                event_id: events.Event_id,
                title: events.Title,
                short_info: events.Short_info,
                host: events.Host,
                user_id: events.User_id,
                details: {
                    start_time: events.Start_time,
                    end_time: events.End_time,
                    date: events.Date,
                    available_tickets: events.Available_ticket,
                    tikcet_price: events.Ticket_price + "$",
                    event_room: events.Event_room,
                    event_room: events.Event_room,
                    event_id: events.Event_id

                }
            }
            return eventObj
        })
        res.status(200).json({
            events
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
getEventById = async(req, res) => {
    const eventId = req.params.eventId;

    const events = await queries.getAllEventsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not exist.`
        });
    } 
    else {
        try {
            const event = await queries.getEventByIdQuery(eventId);
            res.status(200).json({
                event
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};
getSingleEventAndDetails = async(req, res) => {
    const eventId = req.params.eventId;

    const events = await queries.getAllEventsQuery();
    const eventExist = events.some(event => {
        return eventId == event.Id
    });

    if(eventExist == false){
        res.status(400).json({
            success: false,
            message: `Event with ID if ${eventId}, does not exist.`
        });
    } 
    else {
        try {
            const eventAndDetails = await queries.getSingleEventAndDetailsQuery(eventId);
            const event = eventAndDetails.map(events => {
                const eventObj = {
                    event_id: events.Event_id,
                    title: events.Title,
                    short_info: events.Short_info,
                    host: events.Host,
                    user_id: events.User_id,
                    details: {
                        start_time: events.Start_time,
                        end_time: events.End_time,
                        date: events.Date,
                        available_tickets: events.Available_ticket,
                        ticket_price: events.Ticket_price + "$",
                        event_room: events.Event_room
                    }
                }
                return eventObj;
            })
            res.status(200).json({
                event
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};
getEventAndTickets = async(req, res) => {
    const eventId = req.params.eventId;

    const events = await queries.getAllEventsQuery();
    const eventExists = events.some(event => {
        return eventId == event.Id
    });

    const tickets = await ticketQueries.getAllTicketsQuery();
    const ticketExists = tickets.some(ticket => {
        return eventId == ticket.Event_id
    })

    if(eventExists == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID if ${eventId}, does not exist.`
        });
    } 
    else if(ticketExists == false){
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not have tickets.`
        });
    }
    else {
        try {
            const eventAndTickets = await queries.getEventAndTickets(eventId);
            const event = eventAndTickets.map(events => {
                const eventObj = {
                    event_id: events.Event_id,
                    title: events.Title,
                    event_info: events.Event_info,
                    host: events.Host,
                    tickets: {
                        price: events.Price,
                        available_amount: events.Available_amount
                    }
                }
                return eventObj;
            })
            res.status(200).json({
                event
            });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
};

adminDeleteEvent = async(req, res) => {
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    const events = await queries.getAllEventsQuery();
    const eventExist = events.some(event => {
        return eventId == event.Id
    });

    const users = await userQueries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    const userTypes = await userQueries.adminGetOneUserQuery(userId);
    const checkUserType = userTypes[0].User_type;

    if(userExist == false) {
        res.status(400).json({
            success: false,
            message: `User with ID of ${userId}, does not exist.`
        });
    }
    else if(checkUserType == "client"){
        res.status(400).json({
            success: false,
            message: `You don\'t hav permissions to do that.`
        });
    } 
    else if(eventExist == false) {
        res.status(400).json({
            success: false,
            message: `Event with ID of ${eventId}, does not exist.`
        });
    } 
    else {
        try {
            await queries.adminDeleteEventQuery(eventId);
            res.status(200).json({
                message: `Event with ID of ${eventId}, has been deleted.`
            });
        } catch (error) {
            res.status(500).send(error.message);
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
    getEventAndTickets,
    getSingleEventAndDetails
}