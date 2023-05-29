const express = require('express')
const controller = require('./controller')
const auth = require('../middleware/authentication')
const validate = require('../middleware/data_validation')

const router = express.Router()



/******************* Routes ******************/
router.get('/', auth.authenticate, controller.get_events)
router.put('/', auth.authenticate, controller.create)
router.get('/:eventID', auth.authenticate, auth.isHost, controller.get_event)
router.delete('/:eventID', auth.authenticate, auth.isHost, validate.isCompleted, controller.delete_event)
router.post('/:eventID/publish', auth.authenticate, auth.isHost, validate.event_publish, controller.publish)
router.delete('/:eventID/user', auth.authenticate, auth.isHost, controller.delete_user)

const edit_router = require('./editing/route')
// All of the editing actions need to verify host
router.use('/:eventID/edit', auth.authenticate, auth.isHost, edit_router)

const grading_router = require('./grading/route')
router.use('/:eventID/grading', auth.authenticate, auth.isHost, grading_router)

module.exports = router