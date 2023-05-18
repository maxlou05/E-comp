const express = require('express')
const db = require('./database/utils')
const middleware = require('./utils/middleware')

// Create the express app
const app = express()

// Create application/x-www-form-urlencoded body parser
const urlencodedParser = express.urlencoded({ extended: false })
// Create a application/json body parser
const jsonParser = express.json({ strict: false })  // Allows primitive types instead of arrays and objects

// Global settings: alaways use the parsers (middleware) in case recieving body data (these go first)
app.use(urlencodedParser)
app.use(jsonParser)

// Import the routers
const accountRouter = require('./account/route')

// Mount the account router onto the path /account
app.use('/account', accountRouter)

// Error handling (this goes last)
app.use(middleware.HTTPErrorHandler)

module.exports = app