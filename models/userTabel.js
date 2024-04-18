const { Sequelize, DataType } = require("sequelize");
const db = require("../config/database");

const userTabel = db.define(
  "userTabel", 
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING
    }
  },
  {
    tableName: "userTabel"
  }
);

db.sync({ force: true });
module.exports = userTabel;
