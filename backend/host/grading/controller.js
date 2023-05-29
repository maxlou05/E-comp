const { Sequelize } = require('sequelize')
const Activity = require('../../database/models/activity')
const Submission = require('../../database/models/submission')
const HttpError = require('../../utils/HttpError')



async function get_activities(req, res, next) {
    try {
        // Find all the activities that need to be graded manually (of this event)
        const activitySets = await res.locals.event.getActivitySets({
            include: {
                model: Activity,
                attributes: ['id', 'name', 'pointValue'],
                where: {
                    gradingType: 'judge'
                }
            }
        })
        // Reformat the output
        let payload = []
        activitySets.forEach((set) => {
            set.activities.forEach((activity) => {
                payload.push(activity)
            })
        })
        
        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_participants(req, res, next) {
    try {
        // Lazy load the associated participants
        const participants = await res.locals.event.getParticipants({
            // Change the autogenerated foreign key names to more user-friendly ones
            attributes: [
                'id',
                ['userUsername', 'username'],
                ['teamName', 'team']
            ]
        })

        return res
            .status(200)
            .json(participants)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function status(req, res, next) {
    try {
        // Find all the activities that need to be graded manually (of this event)
        const activitySets = await res.locals.event.getActivitySets({
            include: {
                model: Activity,
                attributes: ['id', 'name'],
                where: {
                    gradingType: 'judge'
                },
                incldue: [
                    [Sequelize.literal(`(SELECT COUNT(*) FROM Submissions WHERE Submissions.activityId = activity.id)`), 'total_submissions'],
                    [Sequelize.literal(`(SELECT COUNT(*) FROM Submissions WHERE Submissions.activityId = activity.id AND Submissions.graded = 1)`), 'graded_submissions']
                ]
            }
        })
        // Reformat the output
        let payload = []
        activitySets.forEach((set) => {
            set.activities.forEach((activity) => {
                payload.push(activity)
            })
        })

        return res
            .status(200)
            .json(payload)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function get_submissions_by_activity(req, res, next) {
    try {
        // Get all the submissions for this activity
        const submissions = await res.locals.activity.getSubmissions()

        return res
            .status(200)
            .json(submissions)
    } catch (err) {
        
    }
}

async function get_submissions_by_participant(req, res, next) {
    try {
        // Find all the activities that need to be graded manually (of this event)
        const activitySets = await res.locals.event.getActivitySets({
            include: {
                model: Activity,
                attributes: ['id'],
                where: {
                    gradingType: 'judge'
                }
            }
        })
        // Reformat the activity ids
        let activityIDs = []
        activitySets.activities.forEach((activity) => {
            activityIDs.push(activity.id)
        })

        const submissions = await res.locals.participant.getSubmissions({
            where: {
                activityId: activityIDs  // Giving it a list means it will look if it's in this list
            }
        })

        // Should only be one participant since id is primary key
        return res
            .status(200)
            .json(submissions)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function grade_submission(req, res, next) {
    try {
        if(!req.body.mark) return next(new HttpError(406, 'did not provide a mark'))
        if(req.body.mark > res.locals.activity.pointValue) return next(new HttpError(406, 'given grade is higher than maximum possible mark'))
        res.locals.submission.mark = req.body.mark
        res.locals.submission.graded = true
        await res.locals.submission.sync()

        return res
            .status(201)
            .json({"message": `sucessfully graded submission ${req.params.submissionID}`})
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

module.exports.get_activities = get_activities
module.exports.get_participants = get_participants
module.exports.status = status
module.exports.get_submissions_by_activity = get_submissions_by_activity
module.exports.get_submissions_by_participant = get_submissions_by_participant
module.exports.grade_submission = grade_submission