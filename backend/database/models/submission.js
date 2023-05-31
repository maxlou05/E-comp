const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')

class Submission extends Model {}

const SubmissionModel = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fileType: {
        type: DataTypes.ENUM('pdf', 'jpg', 'png'),
        validate: {
            isIn: [['pdf', 'jpg', 'png']]
        }
    },
    answer: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            len: [1, 100],
            notEmpty: true
        }
    },
    file: {
        type: DataTypes.BLOB('medium')
    },
    mark: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true,
        validate: {
            isInt: true
        }
    },
    graded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
            isBool(value) {
                if(value != true && value != false) throw new HttpError(406, 'must be true or false')
            }
        }
    }
}

Submission.init(SubmissionModel, { sequelize, modelName: 'submission' })

module.exports = Submission