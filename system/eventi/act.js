const queries = require('./query');


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

getAllEvents = async(req, res) => {
    try {
        const events = await queries.getAllEventsQuery();
        res.status(200).json({
            events
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

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
}



module.exports = {
    createEvent,
    adminDeleteEvent,
    adminGetAllEvents,
    getAllEvents
}