const Event = require('../database/models/event')
const Participant = require('../database/models/participant')
const Activity = require('../database/models/activity')
const ActivitySet = require('../database/models/activity_set')
const Submission = require('../database/models/submission')
const HttpError = require('../utils/HttpError')
const Team = require('../database/models/team')
const { Sequelize, Op } = require('sequelize')



/*************** Handlers **************/
async function get_events(req, res, next) {
    try {
        const participants = await Participant.findAll({
            attributes: ['id'],
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
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function join(req, res, next) {
    try {
        // Cannot join the same event twice (event and user has to be unique as a pair)
        const participants = await res.locals.event.getParticipants({
            where: {
                userUsername: res.locals.username
            }
        })
        if(participants.length > 0) return res.status(201).json({"message": "already joined event", "id": participants[0].id})

        // Cannot join a team if not a team event
        if(res.locals.event.teamSize == 1) {
            const participant = await Participant.create({
                userUsername: res.locals.username,
                eventId: req.params.eventID
            })
            return res
                .status(201)
                .json({"message": `joined event ${req.params.eventID}`, "id": participant.id})
        }
        
        // Check if team exists
        const team = await Team.findByPk(req.body.team)
        if(!team) return next(new HttpError(404, `the team ${req.body.team} does not exist`))

        // See if team already has max participants
        const count = await team.getParticipants()
        if(count.length < res.locals.event.teamSize) {
            await team.createParticipant({ eventId: res.locals.event.id, teamName: req.body.team })
        }
        else {
            return next(new HttpError(403, `the team ${req.body.team} is full`))
        }

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
        return next(new HttpError(500, 'unexpected error', err))
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
                // Only already activity sets that already happened
                where: {
                    start: {
                        [Op.gt]: new Date()
                    }
                },
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
            payload.push({"id": activity.id, "name": activity.name, "points": score})
        })
        
        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_submissions(req, res, next) {
    try {
        const submissions = await res.locals.participant.getSubmissions()

        return res
            .status(200)
            .json(submissions)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
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
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_team(req, res, next) {
    try {
        const team = await res.locals.participant.getTeam({
            attributes: ['name']
        })
        if(!team) return next(new HttpError(404, 'you have not joined any team'))
        
        return res
            .status(200)
            .json({"team": team.name})
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
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
                user_data.push({"id": activity.id, "activity": activity.name, "points": score})
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
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function submit(req, res, next) {
    try {
        // Check if the activityID exists in the event
        const event = await res.locals.participant.getEvent({
            include: {
                model: ActivitySet,
                attributes: ['id'],
                // Only on current activity set
                where: {
                    start: {
                        [Op.gt]: new Date()
                    },
                    end: {
                        [Op.lt]: new Date()
                    }
                },
                include: {
                    model: Activity,
                    attributes: ['id', 'gradingType', 'pointValue', 'answers'],
                    include: [
                        // SQL subquery to add a counter column 'submissionCount' from a different table to the results
                        [Sequelize.literal(`(SELECT COUNT(*) FROM Submissions WHERE Submissions.participantId = ${res.locals.participant.id} AND Submissions.activityId = activity.id)`), 'submissionCount']
                    ],
                    where: {
                        activityId: req.params.activityID
                    }
                },
                required: true  // Skips any events without activity sets
            }
        })
        if(!event) return next(new HttpError(404, `the activity with id ${req.params.activityID} does not exist`))

        // Make sure within submission limit
        if(event.activitySets[0].maxSubmissions) {
            if(event.activitySets.activities[0].submissionCount >= event.activitySets[0].maxSubmissions) return next(new HttpError(403, 'already reached max submission limit'))
        }

        // Apply automatic grading system
        if(event.activitySets[0].activities[0].gradingType == 'points') {
            await res.locals.participant.createSubmission({
                mark: event.activitySets[0].activities[0].pointValue * req.body.answer,
                graded: true
            })
        }
        else if(event.activitySets[0].activities[0].gradingType == 'answer') {
            // Check answer against answer key
            let correct = false
            event.activitySets[0].activities[0].answers.forEach((ans) => {
                if(ans == req.body.answer) {
                    // As long as it matches one, then exit the loop
                    correct = true
                    return
                }
            })

            if(correct) {
                await res.locals.participant.createSubmission({
                    answer: req.body.answer,
                    mark: event.activitySets[0].activities[0].pointValue,
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
        // Manual judging
        else {
            // If giving a file, need to specify a file type
            if(req.body.file && !req.body.fileType) return next(new HttpError(406, 'must specify a file type'))
            await res.locals.participant.createSubmission({
                fileType: req.body.fileType,
                answer: req.body.answer,
                file: req.body.file
            })
        }

        return res
            .status(201)
            .json({"message": "activity submitted"})
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
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