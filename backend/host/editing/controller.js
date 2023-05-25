const Event = require('../../database/models/event')
const HTTP_Error = require('../../utils/HTTP_Error')

async function edit_event(req, res, next) {
    const event = req.locals.event
    if(!event) return next(new HTTP_Error(404, `event with id ${req.params.eventID} does not exist`))
    // Anything can be edited when draft
    if(event.draft) {
        // If inputted, then edit
        if(req.body.name) event.name = req.body.name
        if(req.body.start) event.start = req.body.start
        if(req.body.end) event.end = req.body.end
        if(req.body.result) event.result = req.body.result
        if(req.body.description) event.description = req.body.description
        if(req.body.icon) event.icon = req.body.icon
        if(req.body.announcement) event.announcement = req.body.announcement
        if(req.body.teamSize) event.teamSize = req.body.teamSize
        if(req.body.public) event.public = req.body.public
    }
    // Already published but didn't start yet
    else if(event.start > new Date()) {
        if(req.body.description) event.description = req.body.description
        if(req.body.icon) event.icon = req.body.icon
        if(req.body.announcement) event.announcement = req.body.announcement
    }
    // When already started
    else {
        if(req.body.announcement) event.announcement = req.body.announcement
    }
    // Save to database
    try {
        await event.save()
        return res
            .status(201)
            .json({"message": "event updated"})
    } catch (err) {
        return next(new HTTP_Error(500, 'unexpected error', err))
    }
}

module.exports.edit = edit_event