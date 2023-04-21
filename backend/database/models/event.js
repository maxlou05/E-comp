const { DataTypes } = require('sequelize')
const { UserModel } = require('./user')

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
            model: UserModel,
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
        type: DataTypes.STRING(65535)
    },
    Public: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}

const EventModelOptions = {
    tableName: 'Events'
}

module.exports = { EventModel, EventModelOptions }