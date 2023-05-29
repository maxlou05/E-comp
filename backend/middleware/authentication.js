const jwt_utils = require('../utils/jwt')
const hash = require('object-hash')
const User = require('../database/models/user')
const Event = require('../database/models/event')
const HttpError = require('../utils/HttpError')
const Participant = require('../database/models/participant')
const Submission = require('../database/models/submission')
const Activity = require('../database/models/activity')



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
        next(new HttpError(406, "wrong token format, should be 'Bearer [token]'", err))
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
        return next(new HttpError(406, 'did not provide a username'))
    }

    // Query for the user
    const user = await User.findByPk(username)
    // Check if the requested user does not exist
    if (!user) next(new HttpError(406, `the username '${username}' does not exist`))
    // Check if the password was correct
    else if (user.password != hashed_password) next(new HttpError(401, 'incorrect password'))
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
    if(!event) return next(new HttpError(404, `event with id '${req.params.eventID}' does not exist`))
    // Default foreign key with User is userUsername
    if(event.userUsername != res.locals.username) return next(new HttpError(403, 'you are not the host, you do not have permission'))
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
    if(activitySets.length == 0) return next(new HttpError(404, `the activity set with id '${req.params.activitySetID}' does not exist`))
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
    if(activities.length == 0) return next(new HttpError(404, `the activity with id '${req.params.activityID}' does not exist`))
    // Save the activity for later, there should only be 1 since id is primary key
    res.locals.activity = activities[0]
    next()
}

async function participantBelongsToUser(req, res, next) {
    const user = await User.findByPk(res.locals.username, {
        include: {
            model: Participant,
            where: {  // Required is automatically true when using where clauses
                id: req.params.participantID
            }
        }
    })
    if(!user) return next(new HttpError(403, `the participant with id '${req.params.participantID}' does not belong to the user '${res.locals.username}'`))
    // Save the user and the participant for later
    res.locals.user = user
    res.locals.participant = user.participants[0]
    next()
}

async function participantBelongsToEvent(req, res, next) {
    const participants = await res.locals.event.getParticipants({
        where: {
            id: req.params.participantID
        }
    })
    if(participants.length == 0) return next(new HttpError(404, `the participant with id '${req.params.participantID}' does not exist`))
    // Save the participant for later
    res.locals.participant = participants[0] // There should only be one participant, since id is primary key
    next()
}

async function submissionBelongsToEvent(req, res, next) {
    const activitySets = await res.locals.event.getActivitySets({
        include: {
            model: Activity,
            include: {
                model: Submission,
                where: {
                    id: req.params.submissionID
                }
            }
        }
    })
    if(activitySets.length == 0) return next(new HttpError(404, `the submission with id '${req.params.submissionID}' does not exist`))
    // Save the submission and activity
    res.locals.activity = activitySets[0].activities[0]
    res.locals.submission = activitySets[0].activities[0].submissions[0]
    next()
}

module.exports.authenticate = authenticate
module.exports.checkPassword = checkPassword
module.exports.isHost = isHost
module.exports.activitySetBelongsToEvent = activitySetBelongsToEvent
module.exports.activityBelongsToSet = activityBelongsToSet
module.exports.participantBelongsToEvent = participantBelongsToEvent
module.exports.participantBelongsToUser = participantBelongsToUser
module.exports.submissionBelongsToEvent = submissionBelongsToEvent