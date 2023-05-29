const { Op, Sequelize } = require('sequelize')
const Event = require('../database/models/event')
const HttpError = require('../utils/HttpError')
const Activity = require('../database/models/activity')
const Submission = require('../database/models/submission')



/*************** Handlers **************/
async function find_events(req, res, next) {
    try {
        const events = await Event.findAll({
            attributes: ['id', 'name', 'icon', 'start', 'end'],
            where: {
                draft: false,
                public: true,
                start: {
                    [Op.gt]: new Date()
                }
            }
        })

        return res
            .status(200)
            .json(events)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_event(req, res, next) {
    // Already found the event earlier
    return res
        .status(200)
        .json(res.locals.event)
}

async function get_teams(req, res, next) {
    try {
        const teams = await res.locals.event.getTeams({
            attributes: ['name']
        })
        // Reformat the output
        let payload = []
        teams.forEach((team) => {
            payload.push(team.name)
        })

        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function count_participants(req, res, next) {
    try {
        const participants = await res.locals.event.getParticipants({
            attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'num']]
        })

        return res
            .status(200)
            .json(participants.num)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_current_activities(req, res, next) {
    try {
        const now = new Date()
        // Find the current activity set
        const activitySets = await res.locals.event.getActivitySets({
            where: {
                start: {
                    [Op.lt]: now
                },
                end: {
                    [Op.gt]: now
                }
            },
            include: {
                model: Activity
            }
        })
        // If no activity sets are currently running
        if(activitySets.length == 0) return res.status(200).json([])
        // There should only be one activity set running at a time if there is one
        return res
            .status(200)
            .json(activitySets[0].activities)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function leaderboards(req, res, next) {
    try {
        // First, get all the activities
        const activitySets = await res.locals.event.getActivitySets({
            attributes: ['id'],
            include: {
                model: Activity,
                attributes: ['id', 'name']
            }
        })
        // Reformat the output
        let activityIDs = []
        activitySets.forEach((set) => {
            set.activities.forEach((activity) => {
                activityIDs.push({'id': activity.id, 'name': activity.name})
            })
        })
        
        // Get all the teams
        let payload = []
        const teams = await res.locals.event.getTeams()
        // If this event has teams
        if(teams.length != 0) {
            // Loop through all teams to calculate score for each one
            teams.forEach(async (team) => {
                // Get all participants from this team
                const participants = await team.getParticipants({
                    attributes: ['id'],
                    include: {
                        model: Submission,
                        attributes: ['activityId', 'mark']
                    }
                })

                // Get score from each participant
                let team_score = []
                activityIDs.forEach((a) => {
                    let score = 0
                    participants.submissions.forEach((submission) => {
                        if(submission.activityId == a.id) {
                            // If has a mark, then add it
                            if(submission.mark != null) score += submission.mark
                            // If not graded, just add 0 (do nothing)
                        }
                    })
                    team_score.push({"id": a.id, "name": a.name, "points": score})
                })
                payload.push({'team': team.name, 'scores': team_score})
            })
        }
        // Event has no teams
        else {
            // Get all participants
            const participants = await res.locals.event.getParticipants({
                attributes: ['id'],
                include: {
                    model: Submission,
                    attributes: ['activityId', 'mark']
                }
            })
            // Loop through each participant
            let individual_scores = []
            participants.forEach(async (participant) => {
                activityIDs.forEach((a) => {
                    let score = 0
                    participant.submissions.forEach((submission) => {
                        if(submission.activityId == a.id) {
                            // If has a mark, then add it
                            if(submission.mark != null) score += submission.mark
                            // If not graded, just add 0 (do nothing)
                        }
                    })
                    individual_scores.push({"id": a.id, "name": a.name, "points": score})
                })
                const username = await participant.getUser({
                    attributes: ['username']
                })
                payload.push({"user": username, "scores": individual_scores})
            })
        }
        
        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

module.exports.find_events = find_events
module.exports.get_event = get_event
module.exports.find_events = find_events
module.exports.get_teams = get_teams
module.exports.count_participants = count_participants
module.exports.get_current_activities = get_current_activities
module.exports.leaderboards = leaderboards