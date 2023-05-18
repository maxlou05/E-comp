const express = require('express')
const controller = require('./controller')
const middleware = require('../utils/middleware')

const router = express.Router()

/******************* Routes ******************/
router.get('/events', middleware.authenticate, controller.get_events)