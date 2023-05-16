const { Sequelize } = require('sequelize')

// Load environment variables (path is relative to the project root (/backend))
require('dotenv').config({ path: './.env' })

// Settings for the database server
const settings = require('./settings')

let options = undefined
// If using testing environemnt, use these settings instead (local memory)
if(process.env.TEST == 1) options = settings.test
else options = settings.production

module.exports = new Sequelize(options)