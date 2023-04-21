const { DataTypes } = require('sequelize')
const { UserModel } = require('./user')
const { EventModel } = require('./event')

const ParticipantModel = {
    JoinLog: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    User: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: UserModel,
            key: 'Username'
        }
    },
    JoinedEvent: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: EventModel,
            key: 'EventID'
        }
    },
    Team: {
        type: DataTypes.STRING(50)
    }
}

const ParticipantModelOptions = {
    tableName: 'Participants'
}

module.exports = { ParticipantModel, ParticipantModelOptions }