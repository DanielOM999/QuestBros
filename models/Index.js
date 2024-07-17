// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const db = require("../config/database");
const userTable = require("./userTabel");
const formTable = require("./formTabel");
const chatTable = require("./chatTable");

// Define associations
userTable.hasMany(formTable, { onDelete: "CASCADE", as: 'forms', foreignKey: 'userId' });
formTable.belongsTo(userTable, { foreignKey: 'userId' });

module.exports = { db, userTable, formTable, chatTable };
