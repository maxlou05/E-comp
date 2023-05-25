const express = require('express')
const controller = require('./controller')
const auth = require('../../middleware/authentication')

const router = express.Router()

router.get('/status', controller.status)
router.get('/activities', controller.get_activities)
router.get('/participants', controller.get_participants)
router.get('/submissions/activity/:activitySetID/:activityID', auth.activitySetBelongsToEvent, auth.activityBelongsToSet, controller.get_submissions_by_activity)
router.get('submissions/participant/:participantID', auth.participantBelongsToEvent, controller.get_submissions_by_participant)

module.exports = router