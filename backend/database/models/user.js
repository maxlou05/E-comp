const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')

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

User.init(UserModel, {sequelize, modelName: 'User', tableName: 'Users'})

module.exports = User