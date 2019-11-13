const connection = require('../../DB/database');
const queries = require('./query');

const{ createEventQeuery } = queries;


createEvent = async(req, res) => {
    try {
        const eventInfo = req.body;
        const userId = req.params.userId;

        const event = await createEventQeuery(userId, eventInfo);
        res.status(200).json({
            message: 'Event has been created.',
            event
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {
    createEvent
}