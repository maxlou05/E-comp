const { Sequelize } = require('sequelize')
const { config } = require('dotenv')

// load environment variables
config({ path:'./.env' })

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
        timestamps: false  // This disables auto timestamps created by Sequelize on all tables
    }
    // logging: false  // This disables logging, but default logs all database queries to console.log
})

module.exports = { sequelize }