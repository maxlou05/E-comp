const jwt_utils = require('../utils/jwt')
const hash = require('object-hash')
const User = require('../database/models/user')
const Event = require('../database/models/event')
const HTTP_Error = require('../utils/HTTP_Error')
const Participant = require('../database/models/participant')

// Get username from token
async function authenticate(req, res, next) {
    try {
        // Verify the token
        const payload = await jwt_utils.verify(req.headers.authorization.split(' ')[1])
        // If token is invalid, pass on the error to error handler
        if (payload.err) {
            return next(payload.err)
        }
        // If token is valid, save it to locals to pass it on to next middleware or handlers
        res.locals.username = payload.data.sub
        next()
    } catch (err) {
        next(new HTTP_Error(406, "wrong token format, should be 'Bearer [token]'", err))
    }
    
}

// Check the password
async function checkPassword(req, res, next) {
    const hashed_password = hash(req.body.password, { algorithm: process.env.HASH_ALG })

    // See if the we already authenticated the user
    let username = res.locals.username
    // If not authenticated, then should provide a username
    if (!username) username = req.body.username 
    // If still no username, raise error
    if (!username) {
        return next(new HTTP_Error(406, 'did not provide a username'))
    }

    // Query for the user
    const user = await User.findByPk(username)
    // Check if the requested user does not exist
    if (!user) next(new HTTP_Error(406, `the username ${username} does not exist`))
    // Check if the password was correct
    else if (user.password != hashed_password) next(new HTTP_Error(401, 'incorrect password'))
    // If password is correct, then continue without errors
    else {
        // In case the username wasn't given from the token, save it now
        res.locals.username = username
        next()
    }
}

// Check if this user is the host of the event
async function isHost(req, res, next) {
    const event = await Event.findByPk(req.params.eventID)
    if(!event) return next(new HTTP_Error(404, `event with id ${req.params.eventID} does not exist`))
    // Default foreign key with User is userUsername
    if(event.userUsername != res.locals.username) return next(new HTTP_Error(403, 'you are not the host, you do not have permission'))
    // Save the event for later
    res.locals.event = event
    next()
}

// Check if the activity set belongs to the event
async function activitySetBelongsToEvent(req, res, next) {
    const activitySets = await res.locals.event.getActivitySets({
        where: {
            id: req.params.activitySetID
        }
    })
    if(activitySets.length == 0) return next(new HTTP_Error(404, `the activity set with id ${activitySets[0].id} does not exist`))
    // Save the activitySet for later, there should only be 1 since id is primary key
    res.locals.activitySet = activitySets[0]
    next()
}

async function activityBelongsToSet(req, res, next) {
    const activities = await res.locals.activitySet.getActivities({
        where: {
            id: req.params.activityID
        }
    })
    if(activities.length == 0) return next(new HTTP_Error(404, `the activity with id ${activities[0].id} does not exist`))
    // Save the activity for later, there should only be 1 since id is primary key
    res.locals.activity = activities[0]
    next()
}

async function participantBelongsToUser(req, res, next) {
    const user = await User.findByPk(res.locals.username)
    const participant = await Participant.findByPk(req.params.participantID)
    if(!participant) return next(new HTTP_Error(404, `the participant with id ${req.params.participantID} does not exist`))
    // If this participant does not belong to this account
    if(!user.hasParticipant(participant)) return next(new HTTP_Error(404, `the participant with id ${req.params.participantID} does not exist`))
    // Save the user and the participant for later
    res.locals.user = user
    res.locals.participant = participant
    next()
}

async function participantBelongsToEvent(req, res, next) {
    // Don't need check if the participant belongs to event if the event is public
    if(res.locals.event.public) next()
    const participants = await res.locals.event.getParticipants({
        where: {
            id: req.params.participantID
        }
    })
    if(participants.length == 0) return next(new HTTP_Error(404, `the participant with id ${participants[0].id} does not exist`))
    // Save the participant for later, there should only be 1 since id is primary key
    res.locals.participant = participants[0]
    next()
}

module.exports.authenticate = authenticate
module.exports.checkPassword = checkPassword
module.exports.isHost = isHost
module.exports.activitySetBelongsToEvent = activitySetBelongsToEvent
module.exports.activityBelongsToSet = activityBelongsToSet
module.exports.participantBelongsToEvent = participantBelongsToEvent
module.exports.participantBelongsToUser = participantBelongsToUser