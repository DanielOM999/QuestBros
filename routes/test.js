const express = require("express");
const path = require("path");
const _ = require('lodash');
const { Sequelize } = require("sequelize")
const userTabel = require("../models/userTabel");
const formTabel = require("../models/formTabel");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("chat", { layout: "chat" });
});

module.exports = router;