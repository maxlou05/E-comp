const express = require('express')
const controller = require('./controller')
const auth = require('../../../../middleware/authentication')
const validate = require('../../../../middleware/data_validation')

const router = express.Router()



router.get('/', controller.get)
router.put('/', controller.create)
router.post('/:activityID', auth.activityBelongsToSet, controller.edit)
router.delete('/:activityID', auth.activityBelongsToSet, validate.isCompleted, controller.delete)

module.exports = router