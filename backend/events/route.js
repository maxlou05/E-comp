const express = require('express')
const controller = require('./controller')
const validate = require('../middleware/data_validation')

const router = express.Router()



/******************* Routes ******************/
router.get('/find', controller.find_events)
router.get('/:eventID', validate.isPublished, controller.get_event)
router.get('/:eventID/teams', validate.isPublished, controller.get_teams)
router.get('/:eventID/participants', validate.isPublished, controller.count_participants)
router.get('/:eventID/activities', validate.isPublished, controller.get_current_activities)
router.get('/:eventID/leaderboards', validate.isPublished, controller.leaderboards)

module.exports = router