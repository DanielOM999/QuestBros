const { Sequelize } = require("sequelize")
require("dotenv").config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: "5432",
    username: "node",
    password: process.env.SERVER_LOGIN,
    database: "ghosthunting",
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 1000
    },
});

module.exports = sequelize;
