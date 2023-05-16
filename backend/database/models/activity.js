const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')
const ActivitySet = require('./activity_set')

class Activity extends Model {}

const ActivityModel = {
    ActivityID: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    ActivitySetID: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: ActivitySet,
            key: 'ActivitySetID'
        },
        allowNull: false
    },
    ActivityName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ActivityDescription: {
        type: DataTypes.STRING(500)
    },
    InputType: {
        type: DataTypes.ENUM('num', 'str', 'pdf', 'jpg', 'png'),
        allowNull: false
    },
    GradingType: {
        type: DataTypes.ENUM('points', 'answer', 'judge'),
        allowNull: false
    },
    PointValue: {
        type: DataTypes.INTEGER
    },
    Answer: {
        type: DataTypes.STRING(500)
    }
}

Activity.init(ActivityModel, {sequelize, modelName: 'Activity', tableName: 'Activities'})

module.exports = Activity