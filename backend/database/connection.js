const { Sequelize } = require('sequelize')

// Load environment variables (path is relative to the project root (/backend))
require('dotenv').config({ path: './.env' })

// Settings for the database server
const settings = require('./settings')

// If using testing environemnt, use these settings instead (local memory)
let options = settings.production
if(process.env.TEST == 1) options = settings.test

module.exports = new Sequelize(options)