const User = require('../database/models/user')
const Event = require('../database/models/event')
const Participant = require('../database/models/participant')
const Activity = require('../database/models/activity')
const ActivitySet = require('../database/models/activity_set')
const Submission = require('../database/models/submission')
const HTTP_Error = require('../utils/HTTP_Error')



/*************** Handlers **************/
async function get_events(req, res, next) {
    try {
        const participants = await Participant.findAll({
            where: {
                userUsername: res.locals.username
            },
            // For every single participant, since it belongs to one event (defined), query that too
            include: {
                model: Event,
                attributes: ['id', 'name', 'icon', 'start', 'end', 'result']
            }
        })
        
        return res
            .status(200)
            .json(participants)  // Singular 'event' because it is a one to many relationship, participant only has one event
        // [{id: participantID, event: {id: eventID, name: ...}}, {...}, ...]
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function join(req, res, next) {
    try {
        // Cannot join the same event twice (event and user has to be unique as a pair)
        const participants = await Participant.findAll({
            where: {
                userUsername: res.locals.username,
                eventId: req.params.eventID
            }
        })
        if(participants.length > 0) return res.status(201).json({"message": "already joined event"})

        const participant = await Participant.create({
            userUsername: res.locals.username,
            eventId: req.params.eventID,
            teamName: req.body.team
        })

        return res
            .status(201)
            .json({"message": `joined event ${req.params.eventID}`, "id": participant.id})
    } catch (err) {
        // ****TODO: Find out what the foreign key mismatch error is to tell what is wrong****
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function leave(req, res, next) {
    // destroy has no errors, relations take care of the rest
    await res.locals.participant.destroy()

    return res
        .status(200)
        .json({"message": "sucessfully left the event"})
}

async function my_stats(req, res, next) {
    try {
        // Get all the activity ids for this event
        const event = await res.locals.participant.getEvent({
            include: {
                model: ActivitySet,
                attributes: ['id'],
                include: {
                    model: Activity,
                    attributes: ['id', 'name']
                }
            }
        })

        // Foramt all the activities into a list
        let activities = []
        event.activitySets.forEach((set) => {
            activities = activities.concat(set.activities)
        })

        // Get all the submissions
        let payload = []
        const submissions = await res.locals.participant.getSubmissions({
            attributes: ['activityId', 'mark']
        })
        activities.forEach((activity) => {
            let score = 0
            submissions.forEach((submission) => {
                if(submission.activityId == activity.id) {
                    // If has a mark, then add it
                    if(submission.mark != null) score += submission.mark
                    // If not graded, just add 0 (do nothing)
                }
            })
            payload.push({"id": activity.id, "activity": activity.name, "points": score})
        })
        
        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function get_submissions(req, res, next) {
    try {
        const submissions = await res.locals.participant.getSubmissions()

        return res
            .status(200)
            .json(submissions)
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function get_submissions_by_activity(req, res, next) {
    try {
        const submissions = await res.locals.participant.getSubmissions({
            where: {
                activityId: req.params.activityID
            }
        })

        return res
            .status(200)
            .json(submissions)
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function get_team(req, res, next) {
    try {
        const team = await res.locals.participant.getTeam({
            attributes: ['name']
        })
        if(!team) return next(new HTTP_Error(404, 'you have not joined any team'))
        
        return res
            .status(200)
            .json({"team": team.name})
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function get_team_stats(req, res, next) {
    try {
        // Get all the activity ids for this event
        const event = await res.locals.participant.getEvent({
            include: {
                model: ActivitySet,
                attributes: ['id'],
                include: {
                    model: Activity,
                    attributes: ['id', 'name']
                }
            }
        })

        // Foramt all the activities into a list
        let activities = []
        event.activitySets.forEach((set) => {
            activities = activities.concat(set.activities)
        })

        // Get all the participants on this team
        const team = res.locals.participant.getTeam({
            include: {
                model: Participant,
                attributes: ['id'],
                include: {
                    model: Submission,
                    attributes: ['activityId', 'mark']
                }
            }
        })

        let payload = []
        team.participants.forEach(async (participant) => {
            // Tally up all the points this participant earned
            let user_data = []
            activities.forEach((activity) => {
                let score = 0
                participant.submissions.forEach((submission) => {
                    if(submission.activityId == activity.id) {
                        // If has a mark, then add it
                        if(submission.mark != null) score += submission.mark
                        // If not graded, just add 0 (do nothing)
                    }
                })
                user_data.push({"activity": activity.name, "points": score})
            })
            // Find the username of this participant
            const user = await participant.getUser({
                attributes: ['username']
            })
            payload.push({"user": user.username, "data": user_data})
        })

        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function submit(req, res, next) {
    try {
        // Check if the activityID exists in the event
        const event = res.locals.participant.getEvent({
            include: {
                model: ActivitySet,
                attributes: ['id'],
                include: {
                    model: Activity,
                    attributes: ['id', 'gradingType', 'pointValue', 'answers']
                }
            }
        })
        let included = false
        let activity
        event.activitySets.forEach((set) => {
            set.forEach((a) => {
                if(a.id == req.params.activityID) {
                    included = true
                    activity
                    return
                }
            })
            if(included) return
        })
        if(!included) return next(new HTTP_Error(404, `the activity with id ${req.params.activityID} does not exist`))

        // Apply automatic grading system
        if(activity.gradingType == 'points') {
            await res.locals.participant.createSubmission({
                mark: activity.pointValue * req.body.answer,
                graded: true
            })
        }
        else if(activity.gradingType == 'answer') {
            // Check answer against answer key
            let correct = false
            activity.answers.forEach((ans) => {
                if(ans == req.body.answer) {
                    correct = true
                    return
                }
            })

            if(correct) {
                await res.locals.participant.createSubmission({
                    answer: req.body.answer,
                    mark: activity.pointValue,
                    graded: true
                })
            }
            else {
                await res.locals.participant.createSubmission({
                    answer: req.body.answer,
                    mark: 0,
                    graded: true
                })
            }
        }
        else {  // Manual judging
            await res.locals.participant.createSubmission({
                filyType: req.body.fileType,
                answer: req.body.answer,
                file: req.body.file
            })
        }

        return res
            .status(201)
            .json({"message": "activity submitted"})
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

// Export all the functions
module.exports.get_events = get_events
module.exports.join = join
module.exports.leave = leave
module.exports.my_stats = my_stats
module.exports.get_submissions = get_submissions
module.exports.get_submissions_by_activity = get_submissions_by_activity
module.exports.get_team = get_team
module.exports.get_team_stats = get_team_stats
module.exports.submit = submit