const express = require('express')
const controller = require('./controller')
const middleware = require('../utils/middleware')

// Create router object
const router = express.Router()

/**************** Routing (what needs to be run for each request) ****************/
router.put('/', controller.create_account)
// Extra layer security for changing password and deleting account, asks user for password again (tokens have 30mins expiry, so not most secure)
router.post('/', middleware.authenticate, middleware.checkPassword, controller.change_password)
router.delete('/', middleware.authenticate, middleware.checkPassword, controller.delete_account)
router.post('/login', middleware.checkPassword, controller.token)

module.exports = router