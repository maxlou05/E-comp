const express = require('express')
const controller = require('./controller')
const middleware = require('../utils/middleware')

const router = express.Router()
// Create application/x-www-form-urlencoded body parser
const urlencodedParser = express.urlencoded({ extended: false })
// Create a application/json body parser
const jsonParser = express.json({ strict: false })  // Allows primitive types instead of arrays and objects

// Global settings: alaways use the parsers (middleware) in case recieving body data (these go first)
router.use(urlencodedParser)
router.use(jsonParser)

/**************** Routing (what needs to be run for each request) ****************/
router.put('/', controller.create_account)
// Extra layer security for changing password and deleting account, asks user for password again (tokens have 30mins expiry, so not most secure)
router.post('/', middleware.authenticate, middleware.checkPassword, controller.change_password)
router.delete('/', middleware.authenticate, middleware.checkPassword, controller.delete_account)
router.post('/login', middleware.checkPassword, controller.token)
router.get('/', middleware.authenticate, controller.get_username)

// Error handling (this goes last)
router.use(middleware.HTTPErrorHandler)

module.exports = router