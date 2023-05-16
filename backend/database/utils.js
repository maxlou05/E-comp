async function init_db() {
    const sequelize = require('./connection')

    try {
        // Connect the to database server
        await sequelize.authenticate()
        console.log('successfully connected to database server')
    } catch (error) {
        console.error('could not connect to database: ', error)
    }

    // Load environment variables
    require('dotenv').config({ path: './.env' })

    // Load models
    const User = require('./models/user')
    const Participant = require('./models/participant')
    const Event = require('./models/event')
    const ActivitySet = require('./models/activity_set')
    const Activity = require('./models/activity')
    const Submission = require('./models/submission')

    // Reset the database if runnning tests
    let reset = false
    if(process.env.TEST == 1) reset = true

    // Sync all models at the same time
    await sequelize.sync({force: reset})  // force=true will delete all old tables with the same name
    console.log('successfully synced all tables')
}

async function delete_event(eventID) {
    const Event = require('./models/event')
    const ActivitySet = require('./models/activity_set')
    const Activity = require('./models/activity')

    // Get all activitysetIDs
    const activitySetIDs = await ActivitySet.findAll({
        attributes: ['ActivitySetID'],
        where: {
            EventID: eventID
        }
    })
    // Delete all activities under each activity set
    activitySetIDs.forEach(async (value, index, array) => {
        await Activity.destroy({
            where: {
                ActivitySetID: value.ActivitySetID
            }
        })
    })
    // Delete all the activity sets under the event
    await ActivitySet.destroy({
        where: {
            EventID: eventID
        }
    })
    // Delete the event
    await Event.destroy({
        where: {
            EventID: eventID
        }
    })
}

module.exports.init = init_db
module.exports.delete_event = delete_event