const { DataTypes } = require('sequelize')

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

const UserModelOptions = {
    tableName: 'Users'
}

module.exports = { UserModel, UserModelOptions}