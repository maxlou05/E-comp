const express = require('express')
const errHandler = require('./middleware/error_handler')

require('dotenv').config()

// Load CORS middlware, accept everything
const cors = require('cors')

// Create the express app
const app = express()

// Create application/x-www-form-urlencoded body parser
const urlencodedParser = express.urlencoded({ extended: false })
// Create a application/json body parser
const jsonParser = express.json({ strict: false })  // Allows primitive types instead of arrays and objects
// Create a cookoie parser
const cookieParser = require('cookie-parser')

// Global settings: alaways use the parsers (middleware) in case recieving body data (these go first)
app.use(urlencodedParser)
app.use(jsonParser)
app.use(cookieParser())

// CORS settings since frontend and backend are different servers
app.use(cors({
    origin: true,
    allowedHeaders: 'Content-Type',
    credentials: true
}))

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

// Docs
app.get('/docs', (req, res) => {
    return res.json({"message": "https://docs.google.com/document/d/1Qs-lb7VehW8EtMHjkh-9UDxvNwJPPrQfMdG7nekEUzI"})
})

// Error handling (this goes last)
app.use(errHandler.HTTPErrorHandler)

module.exports = app