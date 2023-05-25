const Activity = require('../../../../database/models/activity')
const HTTP_Error = require('../../../../utils/HTTP_Error')



async function get_activities(req, res, next) {
    try {
        const activities = await Activity.findAll({
            where: {
                activitySetId: req.params.activitySetID
            }
        })

        return res
            .status(200)
            .json(activities)
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function create_activity(req, res, next) {
    try {
        // Only allow create if the event is not published
        if(res.locals.event.draft) {
            const activity = await Activity.create({
                activitySetId: req.params.activitySetID,
                name: req.body.name,
                description: req.body.description,
                inputType: req.body.inputType,
                gradingType: req.body.gradingType,
                pointValue: req.body.pointValue,
                answers: req.body.answers
            })

            return res
                .status(201)
                .json({"message": "successfully created the activity", "id": activity.id})
        }
        return next(new HTTP_Error(403, 'cannot edit activity after event is published'))
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

async function edit_activity(req, res, next) {
    // Only allow editing if the event is not published
    if(res.locals.event.draft) {
        const activity = res.locals.activity
        if(req.body.name) activity.name = req.body.name
        if(req.body.description) activity.description = req.body.description
        if(req.body.inputType) activity.inputType = req.body.inputType
        if(req.body.gradingType) activity.gradingType = req.body.gradingType
        if(req.body.pointValue) activity.pointValue = req.body.pointValue
        if(req.body.answers) activity.answers = req.body.answers

        await activity.save()
        return res
            .status(201)
            .json({"message": "activity updated"})
    }

    return next(new HTTP_Error(403, 'cannot edit activity after event is published'))
}

async function delete_activity(req, res, next) {
    // Associations handle the rest, no error for deleting
    await res.locals.activitySet.removeActivity(res.locals.activity)
    return res
        .status(200)
        .json({"message": "successfully deleted the activity"})
}

module.exports.get = get_activities
module.exports.create = create_activity
module.exports.edit = edit_activity
module.exports.delete = delete_activity