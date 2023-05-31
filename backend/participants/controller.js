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
        if(!req.body.team) return next(new HttpError(406, 'this is a team event, please specify a team to join'))
        const team = await Team.findByPk(req.body.team)
        if(!team) return next(new HttpError(404, `the team ${req.body.team} does not exist`))

        // See if team already has max participants
        const count = await team.getParticipants()
        if(count.length >= res.locals.event.teamSize) return next(new HttpError(403, `the team ${req.body.team} is full`))

        const participant = await team.createParticipant({ eventId: res.locals.event.id, teamName: req.body.team, userUsername: res.locals.username })

        return res
            .status(201)
            .json({"message": `joined event ${res.locals.event.name}`, "id": participant.id})
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

async function get_team_stats_total(req, res, next) {
    try {
        // Get all the participants on this team
        const team = await res.locals.participant.getTeam()
        if(!team) return next(new HttpError(403, 'You are not part of any team'))

        let payload = []

        // Get all the participants
        const participants = await team.getParticipants()

        // ***Very interesting to note that async does not work with forEach, since it makes a new function every time it loops
        // Instead, there is a new modern for ... of loop that does the same thing and supports async
        for (const participant of participants) {
            let score = 0
            // Get all their submissions
            const submissions = await participant.getSubmissions()
            // Tally up the score
            submissions.forEach((submission) => {
                if(submission.mark != null) score += submission.mark
            })
            // Get username
            const user = await participant.getUser()
            payload.push({user: user.username, score: score})
        }

        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_team_stats_by_activity(req, res, next) {
    try {
        // Get all the participants on this team
        const team = await res.locals.participant.getTeam()
        if(!team) return next(new HttpError(403, 'You are not part of any team'))

        // Make sure this activity is part of the participant's event
        const activity = await Activity.findByPk(req.params.activityID)
        if(!activity) return next(new HttpError(404, `Activity with id '${req.params.activityID}' does not exist`))
        const activitySet = await ActivitySet.findByPk(activity.activitySetId)
        const event = await Event.findByPk(activitySet.eventId)
        const real_event = await res.locals.participant.getEvent()
        if(event.id != real_event.id) return next(new HttpError(404, `Activity with id '${req.params.activityID}' does not exist`))


        let payload = []

        // Get all the participants
        const participants = await team.getParticipants()

        for (const participant of participants) {
            let score = 0
            // Get all their submissions, but activity specific
            const submissions = await participant.getSubmissions({
                where: {
                    activityId: req.params.activityID
                }
            })
            // Tally up the score
            for (const submission of submissions) {
                if(submission.mark != null) score += submission.mark
            }
            // Get username
            const user = await participant.getUser()
            payload.push({user: user.username, score: score})
        }

        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function submit(req, res, next) {
    try {
        // const event = await res.locals.participant.getEvent({
        //     include: {
        //         model: ActivitySet,
        //         attributes: ['id'],
        //         // Only on current activity set
        //         // where: {
        //         //     start: {
        //         //         [Op.gt]: new Date()
        //         //     },
        //         //     end: {
        //         //         [Op.lt]: new Date()
        //         //     }
        //         // },
        //         // required: true,  // Skips any events without activity sets
        //         include: {
        //             model: Activity,
        //             attributes: { exclude: ['name', 'description', 'answers', 'activitySetId'] },
        //             where: {
        //                 id: req.params.activityID
        //             },
        //             include: {
        //                 model: Submission,
        //                 attributes: ['id'],
        //                 where: {
        //                     activityId: req.params.activityID
        //                 }
        //             }
        //         }
        //     }
        // })

        // Do all this to ensure that the activity is acutally part of the event that the participant is participating in
        // Also, the includes thing for eager loading seems to have bugs, even though it says it supports nested, so resorting to lazy loading
        const event = await res.locals.participant.getEvent()
        if(!event) return next(new HttpError(404, `the activity with id ${req.params.activityID} does not exist`))
        // There should only be 1 by publishing constraints
        const activitySets = await event.getActivitySets({
            where: {
                start: {
                    [Op.gt]: new Date()
                },
                end: {
                    [Op.lt]: new Date()
                }
            }
        })
        if(activitySets.length == 0) return next(new HttpError(403, 'there are currently no activities to submit to'))
        // There should only be 1 because search by primary key
        const activities = await activitySets[0].getActivities({
            where: {
                id: req.params.activityID
            }
        })
        const submissions = await activities[0].getSubmissions({
            where: {
                activityId: req.params.activityID
            }
        })

        // Make sure within submission limit
        if(activitySets[0].maxSubmissions) {
            if(submissions.length >= activitySets[0].maxSubmissions) return next(new HttpError(403, 'already reached max submission limit'))
        }

        // Apply automatic grading system
        if(activities[0].gradingType == 'points') {
            let ans
            try {
                ans = parseInt(req.body.answer)
            } catch (err) {
                return next(new HttpError(406, 'the answer provided was not an integer'))
            }
            await res.locals.participant.createSubmission({
                mark: ans * activities[0].pointValue,
                graded: true
            })
        }
        else if(activities[0].gradingType == 'answer') {
            // Check answer against answer key
            let correct = false
            activities[0].answers.forEach((ans) => {
                if(ans == req.body.answer) {
                    // As long as it matches one, then exit the loop
                    correct = true
                    return
                }
            })

            if(correct) {
                await res.locals.participant.createSubmission({
                    activityId: req.params.activityID,
                    answer: req.body.answer,
                    mark: activities[0].pointValue,
                    graded: true
                })
            }
            else {
                await res.locals.participant.createSubmission({
                    activityId: req.params.activityID,
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
                activityId: req.params.activityID,
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
module.exports.get_team_stats_total = get_team_stats_total
module.exports.get_team_stats_by_activity = get_team_stats_by_activity
module.exports.submit = submit