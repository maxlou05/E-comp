const express = require('express')
const auth = require('../middleware/authentication')
const validate = require('../middleware/data_validation')

const router = express.Router()



/******************* Routes ******************/
// Host
const host_controller = require('./controller')
router.get('/', auth.authenticate, host_controller.get_events)
router.put('/', auth.authenticate, host_controller.create)
router.get('/:eventID', auth.authenticate, auth.isHost, host_controller.get_event)
router.put('/:eventID/team', auth.authenticate, auth.isHost, host_controller.create_team)
router.delete('/:eventID/team/:teamName', auth.authenticate, auth.isHost, auth.teamBelongsToEvent, host_controller.delete_team)
router.delete('/:eventID', auth.authenticate, auth.isHost, validate.isCompleted, host_controller.delete_event)
router.post('/:eventID/publish', auth.authenticate, auth.isHost, validate.event_publish, host_controller.publish)
router.delete('/:eventID/user', auth.authenticate, auth.isHost, host_controller.delete_user)

// Editing events
const edit_controller = require('./editing/controller')
// All of the editing actions need to verify host
router.post('/:eventID/edit', auth.authenticate, auth.isHost, edit_controller.edit)

// Grading events
const grading_controller = require('./grading/controller')
router.get('/:eventID/grading/status', auth.authenticate, auth.isHost, grading_controller.status)
router.get('/:eventID/grading/activities', auth.authenticate, auth.isHost, grading_controller.get_activities)
router.get('/:eventID/grading/participants', auth.authenticate, auth.isHost, grading_controller.get_participants)
router.get('/:eventID/grading/submissions/activity/:activitySetID/:activityID', auth.authenticate, auth.isHost, auth.activitySetBelongsToEvent, auth.activityBelongsToSet, grading_controller.get_submissions_by_activity)
router.get('/:eventID/grading/submissions/participant/:participantID', auth.authenticate, auth.isHost, auth.participantBelongsToEvent, grading_controller.get_submissions_by_participant)
router.post('/:eventID/grading/submissions/:submissionID', auth.authenticate, auth.isHost, auth.submissionBelongsToEvent, grading_controller.grade_submission)

// Activity sets
const set_controller = require('./activityset/controller')
router.get('/:eventID/edit/activitySets', auth.authenticate, auth.isHost, set_controller.get)
router.put('/:eventID/edit/activitySets', auth.authenticate, auth.isHost, set_controller.create)
router.post('/:eventID/edit/activitySets/:activitySetID', auth.authenticate, auth.isHost, auth.activitySetBelongsToEvent, set_controller.edit)
router.delete('/:eventID/edit/activitySets/:activitySetID', auth.authenticate, auth.isHost, auth.activitySetBelongsToEvent, validate.isCompleted, set_controller.delete)

// Activities
const activity_controller = require('./activity/controller')
router.get('/:eventID/edit/activitySets/:activitySetID/activities', auth.authenticate, auth.isHost, auth.activitySetBelongsToEvent, activity_controller.get)
router.put('/:eventID/edit/activitySets/:activitySetID/activities', auth.authenticate, auth.isHost, auth.activitySetBelongsToEvent, activity_controller.create)
router.post('/:eventID/edit/activitySets/:activitySetID/activities/:activityID', auth.authenticate, auth.isHost, auth.activitySetBelongsToEvent, auth.activityBelongsToSet, activity_controller.edit)
router.delete('/:eventID/edit/activitySets/:activitySetID/activities/:activityID', auth.authenticate, auth.isHost, auth.activitySetBelongsToEvent, auth.activityBelongsToSet, validate.isCompleted, activity_controller.delete)

module.exports = router