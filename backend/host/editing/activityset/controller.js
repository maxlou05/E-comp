const ActivitySet = require("../../../database/models/activity_set")
const HttpError = require("../../../utils/HttpError")



async function get_activitySets(req, res, next) {
    try {
        const activitySets = await res.locals.event.getActivitySets({
            attributes: { exclude: ['eventId'] }
        })

        return res
            .status(200)
            .json(activitySets)
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function create_activitySet(req, res, next) {
    try {
        // Only creating activtity sets before publishing
        if(res.locals.event.draft) {
            const activitySet = await ActivitySet.create({
                eventId: req.params.eventID,
                name: req.body.name,
                start: req.body.start,
                end: req.body.end,
                maxSubmissions: req.body.maxSubmissions
            })

            return res
                .status(201)
                .json({"message": "successfully created the activity set", "id": activitySet.id})
        }
        return next(new HttpError(403, 'cannot create activity sets after event is published'))
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function edit_activitySet(req, res, next) {
    try {
        // If event is a draft, then edit. If published, then cannot edit
        if(res.locals.event.draft) {
            const activitySet = res.locals.activitySet
            // Update if given
            if(req.body.name) activitySet.name = req.body.name
            if(req.body.start) activitySet.start = req.body.start
            if(req.body.end) activitySet.end = req.body.end
            if(req.body.maxSubmissions) activitySet.maxSubmissions = req.body.maxSubmissions

            await activitySet.save()
        
            return res
                .status(201)
                .json({"message": "activity set updated"})
        }
        return next(new HttpError(403, 'cannot edit activity sets after event is published'))
    } catch (err) {
        return next(new HttpError(500, 'unexpected error', err))
    }
}

async function delete_activitySet(req, res, next) {
    // Associations handle the rest, no error for deleting
    await res.locals.event.removeActivitySet(res.locals.activitySet)
    return res
        .status(200)
        .json({"message": "successfully deleted activity set"})
}

module.exports.get = get_activitySets
module.exports.create = create_activitySet
module.exports.edit = edit_activitySet
module.exports.delete = delete_activitySet