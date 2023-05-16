const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')
const Event = require('./event')

class ActivitySet extends Model {}

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
            model: Event,
            key: 'EventID'
        },
        allowNull: false
    }
}

ActivitySet.init(ActivitySetModel, {sequelize, modelName: 'ActivitySet', tableName: 'ActivitySets'})

module.exports = ActivitySet