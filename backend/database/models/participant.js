const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')

class Participant extends Model {}

const ParticipantModel = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
}

Participant.init(ParticipantModel, { sequelize, modelName: 'participant' })

module.exports = Participant