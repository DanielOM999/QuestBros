const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");
const crypto = require("crypto");

const userTable = db.define(
  "userTable", 
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    kontakt: {
      type: DataTypes.STRING,
      unique: true
    },
    salt: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "userTable"
  }
);

module.exports = userTable;
