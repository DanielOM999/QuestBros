const { Sequelize, DataType } = require("sequelize");
const db = require("../config/database");

const formTabel = db.define(
  "formTabel", 
  {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: false
    }
  },
  {
    tableName: "formTabel"
  }
);

db.sync({ alter: true }).then(() => {
    module.exports = formTabel;
});