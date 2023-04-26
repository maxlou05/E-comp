const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../connection')
const { User } = require('./user')
const { Event } = require('./event')

class Participant extends Model {}

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
            model: User,
            key: 'Username'
        }
    },
    JoinedEvent: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Event,
            key: 'EventID'
        }
    },
    Team: {
        type: DataTypes.STRING(50)
    }
}

Participant.init(ParticipantModel, { sequelize, tablename:'Participants' })

module.exports = { Participant, ParticipantModel }