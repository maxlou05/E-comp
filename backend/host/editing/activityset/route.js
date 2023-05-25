const express = require('express')
const controller = require('./controller')
const auth = require('../../../middleware/authentication')
const validate = require('../../../middleware/data_validation')

const router = express.Router()



router.get('/', controller.get)
router.put('/', controller.create)
router.post('/:activitySetID', auth.activitySetBelongsToEvent, controller.edit)
router.delete('/:activitySetID', auth.activitySetBelongsToEvent, validate.isCompleted, controller.delete)

const activity_router = require('./activity/route')
// All of the activity actions require verifying that the activity set belogns to the event
router.use('/:activitySetID/activities', auth.activitySetBelongsToEvent, activity_router)

module.exports = router