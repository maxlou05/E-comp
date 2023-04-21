const { DataTypes } = require('sequelize')
const { ActivitySetModel } = require('./activity_set')

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
            model: ActivitySetModel,
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

const ActivityModelOptions = {
    tableName: 'Activities'
}

module.exports = { ActivityModel, ActivityModelOptions }