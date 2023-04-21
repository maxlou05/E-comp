const { DataTypes } = require('sequelize')
const { EventModel } = require('./event')

const ActivitySetModel = {
    ActivitySetID: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    SetName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    SetStart: {
        type: DataTypes.DATE,
        allowNull: false
    },
    SetEnd: {
        type: DataTypes.DATE,
        allowNull: false
    },
    MaxSubmissions: {
        type: DataTypes.INTEGER.UNSIGNED,
    },
    EventID: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: EventModel,
            key: 'EventID'
        },
        allowNull: false
    }
}

const ActivitySetModelOptions = {
    tableName: 'ActivitySets'
}

module.exports = { ActivitySetModel, ActivitySetModelOptions }