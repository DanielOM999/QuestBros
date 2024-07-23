const { Sequelize } = require("sequelize")
require("dotenv").config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: "6543",
    username: "postgres.wuhtbzikkvsplzhdgpsn",
    password: process.env.SERVER_LOGIN,
    database: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 1000
    },
});

module.exports = sequelize;