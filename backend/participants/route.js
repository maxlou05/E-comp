const express = require('express')
const controller = require('./controller')
const auth = require('../middleware/authentication')

const router = express.Router()

/******************* Routes ******************/
router.get('/events', auth.authenticate, controller.get_events)
router.put('/join/:eventID', auth.authenticate, controller.join)
router.delete('/:participantID/leave', auth.authenticate, auth.participantBelongsToUser, controller.leave)
router.get('/:participantID/submissions', auth.authenticate, auth.participantBelongsToUser, controller.get_submissions)
router.get('/:participantID/submissions/activity/:activityID', auth.authenticate, auth.participantBelongsToUser, controller.get_submissions_by_activity)
router.get('/:participantID/team', auth.authenticate, auth.participantBelongsToUser, controller.get_team)
router.get('/:participantID/team/stats', auth.authenticate, auth.participantBelongsToUser, controller.get_team_stats)
router.put('/:participantID/submit/:activityID', auth.authenticate, auth.participantBelongsToUser, controller.submit)

module.exports = router