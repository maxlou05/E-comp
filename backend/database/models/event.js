const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')
const User = require('./user')

class Event extends Model {}

const EventModel = {
    EventID: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Host: {
        type: DataTypes.STRING(50),
        references: {
            model: User,
            key: 'Username'
        },
        allowNull: false
    },
    EventName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    EventDescription: {
        type: DataTypes.STRING(500)
    },
    EventIcon: {
        type: DataTypes.BLOB('medium')
    },
    EventStart: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EventEnd: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ResultsDate: {
        type: DataTypes.DATE
    },
    Announcement: {
        type: DataTypes.STRING(250)
    },
    Team: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    Teams: {
        type: DataTypes.STRING(2000)
    },
    Draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    Public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}

Event.init(EventModel, {sequelize, modelName: 'Event', tableName: 'Events'})

module.exports = Event