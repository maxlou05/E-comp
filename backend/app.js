const express = require('express')
const db = require('./database/utils')

// Create the express app
const app = express()

// Import the routers
const accountRouter = require('./account/route')

// Mount the account router onto the path /account
app.use('/account', accountRouter)

// Initialize the database
db.init()

module.exports = app
