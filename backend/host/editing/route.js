const express = require('express')
const controller = require('./controller')

const router = express.Router()



/************** Routes *************/
router.post('/', controller.edit)

const activitySet_router = require('./activityset/route')
// Already verified host
router.use('/activitySets', activitySet_router)

module.exports = router