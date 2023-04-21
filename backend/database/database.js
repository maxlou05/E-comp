const { Sequelize } = require('sequelize')
const { config } = require('dotenv')
const { UserModel, UserModelOptions } = require('./models/user')
const { ParticipantModel, ParticipantModelOptions } = require('./models/participant')
const { EventModel, EventModelOptions } = require('./models/event')
const { ActivitySetModel, ActivitySetModelOptions } = require('./models/activity_set')
const { ActivityModel, ActivityModelOptions } = require('./models/activity')
const { SubmissionModel, SubmissionModelOptions } = require('./models/submission')

// load environment variables
config()

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
        timestamps: false  // This disables auto timestamps created by Sequelize on all tables
    }
    // logging: false  // This disables logging, but default logs all database queries to console.log
})

async function connect() {
    try {
        // Connect the to database server
        await sequelize.authenticate()
        console.log('successfully connected to database')
    } catch (error) {
        console.error('could not connect to database: ', error)
    }
}
connect()

// Initialize/define all tables/models
sequelize.define('User', UserModel, UserModelOptions)
sequelize.define('Participant', ParticipantModel, ParticipantModelOptions)
sequelize.define('Event', EventModel, EventModelOptions)
sequelize.define('ActivitySet', ActivitySetModel, ActivitySetModelOptions)
sequelize.define('Activity', ActivityModel, ActivityModelOptions)
sequelize.define('Submission', SubmissionModel, SubmissionModelOptions)

async function create_tables() {
    // Create all tables (for all defined models)
    await sequelize.sync({ force: true })  // force=true will delete all old tables with the same name
    console.log('successfully synced all tables')
}
create_tables()