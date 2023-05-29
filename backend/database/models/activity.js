const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')
const HttpError = require('../../utils/HttpError')

class Activity extends Model {}

const ActivityModel = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        defaultValue: 'new activity',
        allowNull: false,
        validate: {
            len: [1, 100],
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING(500)
    },
    inputType: {
        type: DataTypes.ENUM('num', 'str', 'file'),
        defaultValue: 'num',
        allowNull: false,
        validate: {
            isIn: [['num', 'str', 'file']],
            grading(value) {
                if(this.getDataValue('gradingType') == 'points') {
                    if(value != 'num') throw new HttpError(406, 'grading type points is only supported with input type num')
                }
                else if(this.getDataValue('gradingType') == 'answer') {
                    if(value != 'str') throw new HttpError(406, 'grading type answer is only supported with input type str, please save numbers as strings')
                }
                else if(this.getDataValue('gradingType') == 'judge') {
                    if(value == 'num') throw new HttpError(406, 'grading type judge is not supported with input type num')
                }
            }
        }
    },
    gradingType: {
        type: DataTypes.ENUM('points', 'answer', 'judge'),
        defaultValue: 'points',
        allowNull: false,
        validate: {
            isIn: [['points', 'answer', 'judge']]
        }
    },
    pointValue: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            isInt: true
        }
    },
    answers: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        validate: {
            len: [1, 1000],
            notEmpty: true
        },
        set(value) {
            this.setDataValue('answers', JSON.stringify(value))
        },
        get() {
            return JSON.parse(this.getDataValue('answers'))
        }
    }
}

Activity.init(ActivityModel, { sequelize, modelName: 'activity' })

module.exports = Activity