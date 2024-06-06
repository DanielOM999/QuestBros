const { Sequelize, DataTypes } = require('sequelize');
const db = require("../config/database");
const userTabel = require("./userTabel");
const formTabel = require("./formTabel");

userTabel.hasMany(formTabel, { foreignKey: 'userId' });
formTabel.belongsTo(userTabel, { foreignKey: 'userId' });

module.exports = {
    db,
    userTabel,
    formTabel
};