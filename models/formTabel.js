const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const formTable = db.define(
  "formTable",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    tableName: "formTable"
  }
);

module.exports = formTable;
