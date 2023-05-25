async function init_db(reset = true) {
    const sequelize = require('./connection')

    try {
        // Connect the to database server
        await sequelize.authenticate()
    } catch (error) {
        return Promise.reject(error)
    }

    // Load environment variables
    require('dotenv').config({ path: './.env' })

    // Load models
    const User = require('./models/user')
    const Participant = require('./models/participant')
    const Team = require('./models/team')
    const Event = require('./models/event')
    const ActivitySet = require('./models/activity_set')
    const Activity = require('./models/activity')
    const Submission = require('./models/submission')

    // Set up associations (relationships)
    // Users (account/host) can have many events
    User.hasMany(Event, {
        onDelete: 'CASCADE',  // If deleting the user, delete all his hosted events
        onUpdate: 'CASCADE',
        foreignKey: {  // Default foreign key field names are [Table][Primary Key], ie 'UserUsername' if User is the table and username is the primary key
            allowNull: false  // An event cannot exist without a host
        }
    })
    Event.belongsTo(User)

    // Event has many activty sets
    Event.hasMany(ActivitySet, {
        onDelete: 'CASCADE',  // If deleting the event, delete the activity sets
        onUpdate: 'CASCADE',
        foreignKey: {
            allowNull: false  // An activity set cannot exist without an event
        }
    })
    ActivitySet.belongsTo(Event)

    // Activity set has many activities
    ActivitySet.hasMany(Activity, {
        onDelete: 'CASCADE',  // If deleting the activity set, delete the actvities
        onUpdate: 'CASCADE',
        foreignKey: {
            allowNull: false  // An activity cannot exist without an activity set
        }
    })
    Activity.belongsTo(ActivitySet)

    // Activity has many submissions
    Activity.hasMany(Submission, {
        onDelete: 'CASCADE',  // If deleting the activity, delete the submissions
        onUpdate: 'CASCADE',
        foreignKey: {
            allowNull: false  // A submission cannot exist without an activity
        }
    })
    Submission.belongsTo(Activity)

    // Users can participate in many events, so they can 'create' many participants
    User.hasMany(Participant, {
        onDelete: 'CASCADE',  // If deleting the user (account/host), delete all their 'participants'
        onUpdate: 'CASCADE',
        foreignKey: {
            allowNull: false  // A participant cannot exist without an account
        }
    })
    Participant.belongsTo(User)

    // Events can have many participants (for solo/non-team events)
    Event.hasMany(Participant, {
        onDelete: 'CASCADE',  // If deleting the event, delete all the participants
        onUpdate: 'CASCADE',
        foreignKey: {
            allowNull: false  // A participant cannot exist without an event
        }
    })
    Participant.belongsTo(Event)

    // Events can have many teams (for team events)
    Event.hasMany(Team, {
        onDelete: 'CASCADE',  // If deleting the event, delete all the teams
        onUpdate: 'CASCADE',
        foreignKey: {
            allowNull: false  // A team cannot exist without an event
        }
    })
    Team.belongsTo(Event)

    // Teams have many participants
    Team.hasMany(Participant, {
        onDelete: 'SET NULL',  // If deleting the team, set the participant's team to null, don't delete the participant (participant can have no team)
        onUpdate: 'CASCADE'
    })
    Participant.belongsTo(Team)

    // A participant can have many submissions
    Participant.hasMany(Submission, {
        onDelete: 'CASCADE',  // If deleting the participant, delete all their submissions
        onUpdate: 'CASCADE',
        foreignKey: {
            allowNull: false  // A submission cannot exist without a participant
        }
    })
    Submission.belongsTo(Participant)

    // Sync all models
    try {
        await sequelize.sync({force: reset})  // force=true will delete all old tables with the same name
    } catch (error) {
        return Promise.reject(error)
    }
    return Promise.resolve('finished database initialization')
}

module.exports.init = init_db