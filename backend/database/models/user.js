const { DataTypes, Model } = require('sequelize')
const sequelize = require('../connection')

// hash settings
const hash = require('object-hash')
require('dotenv').config({ path: './.env' })

class User extends Model {}

// Define the table and row properties
const UserModel = {
    username: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        validate: {
            len: [1, 50],
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        // Create a setter so that everytime a password is saved it is hashed first
        set(value) {
            this.setDataValue('password', hash(value, { algorithm: process.env.HASH_ALG }))
        },
        // Data validation, regexp for 64 character hex
        validate: {
            is: /^[0-9a-f]{64}$/i
        }
    }
}

User.init(UserModel, { sequelize, modelName: 'user' })

module.exports = User