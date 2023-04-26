const { sequelize } = require('./connection')

async function connect() {
    try {
        // Connect the to database server
        await sequelize.authenticate()
        console.log('successfully connected to database')
    } catch (error) {
        console.error('could not connect to database: ', error)
    }
}
// connect()

async function reset_db() {
    // load in all the tables (initialize models)
    const { User } = require('./models/user')
    const { Participant } = require('./models/participant')
    const { Event } = require('./models/event')
    const { ActivitySet } = require('./models/activity_set')
    const { Activity } = require('./models/activity')
    const { Submission } = require('./models/submission')

    // Delete the old database
    await sequelize.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`)
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
    await sequelize.query(`USE ${process.env.DB_NAME}`)

    // Create all tables (for all defined models)
    await sequelize.sync({ force: true })  // force=true will delete all old tables with the same name
    console.log('successfully synced all tables')
}
// reset_db()

module.exports = { connect, reset_db }