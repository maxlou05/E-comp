const Event = require('../database/models/event')
const Participant = require('../database/models/participant')
const Team = require('../database/models/team')
const HttpError = require('../utils/HttpError')



async function get_events(req, res, next) {
    try {
        const events = await Event.findAll({
            attributes: ['id', 'name', 'icon', 'start', 'end', 'result', 'draft', 'public'],
            where: {
                userUsername: res.locals.username
            }
        })

        return res
            .status(200)
            .json(events)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function create_event(req, res, next) {
    try{
        const event = await Event.create({
            userUsername: res.locals.username,
            name: req.body.name,
            description: req.body.description,
            icon: req.body.icon,
            start: req.body.start,
            end: req.body.end,
            result: req.body.result,
            announcement: req.body.announcement,
            teamSize: req.body.teamSize,
            public: req.body.public
        })

        return res
            .status(201)
            .json({"message": "successfully created the event", "id": event.id})
    } catch(err) {
        // This should not have any errors, since any input will work
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function publish_event(req, res, next) {
    // Already published, no need to check again
    if(!res.locals.event.draft) return res.status(201).json({"message": "event already published"})

    try {
        const rows_updated = await Event.update({ draft: false }, {
            where: {
                id: req.params.eventID
            }
        })

        return res
            .status(201)
            .json({"message": "successfully published event"})
    } catch(err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function create_team(req, res, next) {
    try {
        // Make sure event is still a draft
        if(!res.locals.event.draft) return next(new HttpError(403, 'cannot add teams once event is published'))
        await Team.create({name: req.body.team, eventId: res.locals.event.id})
    return res
        .status(201)
        .json({"message": "successfully created a team"})
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
    
}

async function delete_team(req, res, next) {
    try {
        // Make sure event is still a draft
        if(!res.locals.event.draft) return next(new HttpError(403, 'cannot delete teams once event is published'))
        await Team.destroy({
            where: {
                name: req.params.teamName
            }
        })
    return res
        .status(200)
        .json({"message": "successfully deleted the team"})
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_event(req, res, next) {
    // Already queried this event in host validation
    return res
        .status(200)
        .json(res.locals.event)
}

async function delete_event(req, res, next) {
    // Associations handle the rest, no error for deleting
    await Event.destroy({
        where: {
            id: req.params.eventID
        }
    })
    return res
        .status(200)
        .json({"message": "successfully deleted event"})
}

async function delete_user(req, res, next) {
    if(!req.body.username) next(new HttpError(406, 'did not provide a username'))

    // Delete that user's participant from this event
    await Participant.destroy({
        where: {
            userUsername: req.params.username,
            eventId: req.params.eventID
        }
    })

    return res
        .status(200)
        .json({"message": `successfully removed the user ${req.body.username}`})
}

module.exports.create = create_event
module.exports.publish = publish_event
module.exports.get_events = get_events
module.exports.create_team = create_team
module.exports.delete_team = delete_team
module.exports.get_event = get_event
module.exports.delete_event = delete_event
module.exports.delete_user = delete_user