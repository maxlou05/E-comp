const User = require('../database/models/user')
const Event = require('../database/models/event')
const Participant = require('../database/models/participant')

/*************** Handlers **************/
async function get_events(req, res, next) {
    let payload = []
    // Get all the eventIDs first
    const eventIDs = await Participant.findAll({
        attributes: ['JoinedEvent'],
        where: {
            User: res.locals.username
        }
    })
    // Get event metadata for each joined event
    eventIDs.forEach(async (value, index, array) => {
        const data = await Event.findByPk(value.JoinedEvent)
        payload.push(data.dataValues)  // dataValues is the row object's data
    })
    return res
        .status(200)
        .json({"message": "all joined event metadata", "data": payload})
}

// Export all the functions
module.exports.get_events = get_events