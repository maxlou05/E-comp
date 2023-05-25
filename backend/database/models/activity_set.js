const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')

class ActivitySet extends Model {}

const ActivitySetModel = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        defaultValue: 'draft activity set',
        allowNull: false,
        validate: {
            len: [1, 100],
            notEmpty: true
        }
    },
    start: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    },
    end: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    },
    maxSubmissions: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        validate: {
            isInt: true,
            min: 1  // null for infinite submissions
        }
    }
}

ActivitySet.init(ActivitySetModel, { sequelize, modelName: 'activitySet' })

module.exports = ActivitySet