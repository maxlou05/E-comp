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
        const participants = await res.locals.event.getParticipants()

        return res
            .status(200)
            .json(participants.length)
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
        let payload = []
        // If solo event
        if(!res.locals.event.teamSize) {
            // Get all participants
            const participants = await res.locals.event.getParticipants()
            for (const participant of participants) {
                let score = 0
                // Get all submissions
                const submissions = await participant.getSubmissions()
                for (const submission of submissions) {
                    // Tally up score
                    if(submission.mark != null) score += submission.mark
                }
                payload.push({team: team.name, score: score})
            }
        }
        // If team event
        else {
            // Get all the teams
            const teams = await res.locals.event.getTeams()
            for (const team of teams) {
                let score = 0
                // Get all participants
                const participants = await team.getParticipants()
                for (const participant of participants) {
                    // Get all submissions
                    const submissions = await participant.getSubmissions()
                    for (const submission of submissions) {
                        // Tally up score
                        if(submission.mark != null) score += submission.mark
                    }
                }
                payload.push({team: team.name, score: score})
            }
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
module.exports.get_teams = get_teams
module.exports.count_participants = count_participants
module.exports.get_current_activities = get_current_activities
module.exports.leaderboards = leaderboards