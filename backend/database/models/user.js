const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../connection')

class User extends Model {}

// Define the table and row properties
const UserModel = {
    Username: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    HashedPassword: {
        type: DataTypes.STRING(64),
        allowNull: false
    }
}

// Initialize it
User.init(UserModel, { sequelize, tableName:'Users' })  // placing just the 'sequelize' in the object means both key and value has same variable name (shorthand)
// User.sync({ force: true })

module.exports = { User }