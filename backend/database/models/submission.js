const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../connection')
const { Activity } = require('./activity')
const { User } = require('./user')

class Submission extends Model {}

const SubmissionModel = {
    SubmissionID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ActivityID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Activity,
            key: 'ActivityID'
        }
    },
    User: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: User,
            key: 'Username'
        }
    },
    Team: {
        type: DataTypes.STRING(50)
    },
    SubmittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    InputType: {
        type: DataTypes.ENUM('num', 'str', 'pdf', 'jpg', 'png'),
        allowNull: false
    },
    NumSubmission: {
        type: DataTypes.DECIMAL(20, 10)
    },
    StrSubmission: {
        type: DataTypes.STRING(500)
    },
    FileSubmission: {
        type: DataTypes.BLOB('medium')
    },
    Mark: {
        type: DataTypes.INTEGER
    },
    Graded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}

Submission.init(SubmissionModel, { sequelize, tableName:'Submissions' })

module.exports = { Submission }