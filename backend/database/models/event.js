const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')
const isBool = require('../../middleware/data_validation').isBool

class Event extends Model {}

const EventModel = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        defaultValue: 'draft event',
        allowNull: false,
        validate: {
            len: [1, 100],
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
            len: [0, 500]
        }
    },
    icon: {
        type: DataTypes.BLOB('medium')
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
    result: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    },
    announcement: {
        type: DataTypes.STRING(250),
        allowNull: true,
        validate: {
            len: [0, 250]
        }
    },
    teamSize: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        validate: {
            isInt: true,
            min: 1  // 1 for infinite size teams, null for solo (no teams)
        }
    },
    draft: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        validate: {
            isBool
        }
    },
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
            isBool
        }
    }
}

Event.init(EventModel, { sequelize, modelName: 'event' })

module.exports = Event