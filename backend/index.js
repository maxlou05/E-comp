const http = require('http')
const db = require('./database/utils')

// Load environment variables
require('dotenv').config({ path: './.env' })

// Get the app
const app = require('./app')

// Start database
db.init(false)
    .then((message) => {
        console.log(message)
        // Starting server after database is started
        http.createServer(app).listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
            console.log(`server started at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
        })
    })
    .catch((err) => {
        console.error('could not initialize database: ', err)
    })