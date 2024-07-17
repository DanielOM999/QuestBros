const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const chatTable = db.define(
  "chatTable",
  {
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "chatTable",
  }
);

module.exports = chatTable;
