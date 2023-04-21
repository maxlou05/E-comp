const { DataTypes } = require('sequelize')
const { ActivityModel } = require('./activity')
const { UserModel } = require('./user')

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
            model: ActivityModel,
            key: 'ActivityID'
        }
    },
    User: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: UserModel,
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

const SubmissionModelOptions = {
    tableName: 'Submissions'
}

module.exports = { SubmissionModel, SubmissionModelOptions }