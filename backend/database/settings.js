require('dotenv').config({ path: './.env' })

const production = {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
        timestamps: false  // This disables auto timestamps created by Sequelize on all tables
    },
    logging: process.env.TEST_LOGS == 1 ? true : false  // This enables/disables logging. true logs all database queries to console.log
}

const test = {
    dialect: 'sqlite',
    storage: ':memory:',
    define: {
        timestamps: false
    },
    logging: process.env.TEST_LOGS == 1 ? true : false
}

module.exports.production = production
module.exports.test = test