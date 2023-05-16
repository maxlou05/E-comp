const http = require('http')

// Load environment variables
require('dotenv').config({ path: './.env' })

// Get the app
const app = require('./app')

// Starting server
http.createServer(app).listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`server started at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})