const express = require('express')
const db = require('./database/utils')
const errHandler = require('./middleware/error_handler')

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
const hostRouter = require('./host/route')
const participantRouter = require('./participants/route')
const eventRouter = require('./events/route')

// Mount the account router onto the path /account
app.use('/account', accountRouter)
app.use('/host', hostRouter)
app.use('/participant', participantRouter)
app.use('/events', eventRouter)

// Error handling (this goes last)
app.use(errHandler.HTTPErrorHandler)

module.exports = app