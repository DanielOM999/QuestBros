const { Sequelize, DataType } = require("sequelize");
const db = require("../config/database");

const userTabel = db.define(
  "userTabel", 
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    salt: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "userTabel"
  }
);

db.sync({ force: true });
module.exports = userTabel;
