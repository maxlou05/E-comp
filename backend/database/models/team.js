const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')

class Team extends Model {}

// Define the table and row properties
const TeamModel = {
    name: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        validate: {
            len: [1, 50],
            notEmpty: true
        }
    }
}

Team.init(TeamModel, { sequelize, modelName: 'team' })

module.exports = Team