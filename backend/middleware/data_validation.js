const HttpError = require('../utils/HttpError')
const Activity = require('../database/models/activity')
const Event = require('../database/models/event')



async function event_publish(req, res, next) {
    const now = new Date()
    // Start date is in the future
    if(!res.locals.event.start) return next(new HttpError(406, 'event must have a start date'))
    if(res.locals.event.start < now) return next(new HttpError(406, 'cannot start the event in the past'))

    // End date is after start date
    if(!res.locals.event.end) return next(new HttpError(406, 'event must have an end date'))
    if(res.locals.event.end < res.locals.event.start) return next(new HttpError(406, 'cannot end the event before it begins'))

    // Judge date is after end date, if there is one
    if(res.locals.event.result) {
        if(res.locals.event.result < res.locals.event.end) return next(new HttpError(406, 'cannot give results before event ends'))
    }

    try {
        const activitySets = await res.locals.event.getActivitySets({
            include: Activity,
            // Order the activity sets by start dates from least (earliest) to greatest (latest)
            order: [
                ['start', 'ASC']
            ]
        })
        // Needs activities
        if(activitySets.length == 0) return next(new HttpError(406, 'need to have at least 1 activity set'))
        activitySets.forEach((set) => {
            if(set.activities.length == 0) return next(new HttpError(406, `need to have at least 1 activity in activity set ${set.name}`, {"id": set.id}))
            // Validate the activities
            set.activities.forEach((activity) => {
                // Make sure that all the answer activities have an answer key to auto grade
                if(activity.gradingType == 'answer') {
                    if(!activity.answers || activity.answers.length == 0) return next(new HttpError(406, `the activity ${activity.name} needs an answer`, {"id": activity.id}))
                }
            })
        })
        // ActivitySets must have start and end dates, and be in order
        for (let i = 0; i < activitySets.length; i++) {
            const set = activitySets[i];
            if(!set.start) return next(new HttpError(406, `activity set ${set.name} must have a start date`, {"id": set.id}))
            if(!set.end) return next(new HttpError(406, `activity set ${set.name} must have an end date`, {"id": set.id}))
            if(set.end < set.start) return next(new HttpError(406, `activity set ${set.name} cannot end before it begins`, {"id": set.id}))
            if(i == 0) {
                // First one should start after the event starts
                if(set.start < res.locals.event.start) return next(new HttpError(406, `activity set ${set.name} cannot start before event starts`, {"id": set.id}))
            }
            else if(i < activitySets.length - 1) {
                // Since ordered by start time, the end of each should be less than the start of the next one
                if(set.end > activitySets[i+1].start) return next(new HttpError(406, `activity set ${set.name} is running concurrently with set ${activitySets[i+1].name}`, {"ids": [set.id, activitySets[i+1].id]}))
            }
            if(i == activitySets.length - 1) {
                // Last one should end before event ends
                if(set.end > res.locals.event.end) return next(new HttpError(406, `activity set ${set.name} cannot end after event ends`, {"id": set.id}))
            }
        }
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }

    next()
}

async function isPublished(req, res, next) {
    const event = await Event.findByPk(req.params.eventID)
    if(!event) return next(new HttpError(404, `event with id ${req.params.eventID} does not exist`))
    if(event.draft) return next(new HttpError(404, `event with id ${req.params.eventID} does not exist`))
    // Save the event for later
    res.locals.event = event
    next()
}

function isCompleted(req, res, next) {
    const now = new Date()
    // If it's a draft, doesn't matter
    if(!res.locals.event.draft) {
        // If there is a results date
        if(res.locals.event.result) {
            if(res.locals.event.result > now) return next(new HttpError(403, 'cannot delete activity set while event is happening'))
        }
        else {
            if(res.locals.event.end > now) return next(new HttpError(403, 'cannot delete activity set while event is happening'))
        }
    }
    next()
}

module.exports.event_publish = event_publish
module.exports.isPublished = isPublished
module.exports.isCompleted = isCompleted