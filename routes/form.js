const express = require("express");
let crypto = require("crypto");
const { Sequelize } = require("sequelize");
let passport = require("passport");
const bodyParser = require("body-parser");
let LocalStrategy = require("passport-local");
const userTabel = require("../models/userTabel");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const formTabel = require("../models/formTabel");
const db = require('../config/database');
const _ = require('lodash');
const WebSocket = require("ws");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

const wss = new WebSocket.Server({ port: 8082 });

const messagesFilePath = path.join(__dirname, 'messages.json');

function appendMessage(message) {
  let messages = [];
  try {
      const messagesData = fs.readFileSync(messagesFilePath, 'utf8');
      messages = JSON.parse(messagesData);
  } catch (err) {
    console.log(err);
  }

  messages.push(message);

  try {
      fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
      console.log('Message appended successfully.');
      return true;
  } catch (err) {
      console.error('Error writing to messages.json:', err);
      return false;
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    appendMessage(JSON.parse(message));
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
        }
    });
  });
});

async function getUsersWithFormsData() {
    try {
        let users = await userTabel.findAll({
            include: [{
                model: formTabel,
                as: 'forms'
            }]
        });
        let usersJson = users.map(user => user.toJSON());
        
        const newJSON = usersJson.flatMap(user => {
            return user.forms.map(form => {
                return {
                    id: form.id,
                    name: user.username,
                    email: user.kontakt,
                    description: user.description,
                    profilePic: user.image,
                    formName: form.name,
                    formDesc: form.description,
                    tags: form.tags
                };
            });
        });

        // let shuffledJSON = _.shuffle(newJSON);
        return newJSON;
    } catch (error) {
        console.log(`Error fetching form data: ${error}`);
        return null;
    }
}

router.get("/", (req, res) => {
    res.render("form");
});

router.get("/forms", async (req, res) => {
    const formsData = await getUsersWithFormsData();
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 4;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    const paginatedForms = formsData.slice(startIndex, endIndex);
    res.json(paginatedForms);
});

router.get("/create", (req, res) => {
    if(req.user) {
        res.render("createForm", { layout: "CreateForm" });
    }else {
        res.redirect("/users/req")
    }
});

router.post("/create", async (req, res) => {
    const { formname, formdescription, formtags } = req.body;

    if (!formname || !formdescription || !formtags) {
        return res.status(400).send("All fields are required!");
    }

    const transaction = await db.transaction();
    try {
        await formTabel.create({
            name: formname,
            description: formdescription,
            tags: formtags
        }, { transaction });
        await transaction.commit();
        console.log(`\nInserted: ${formname}\n`);
    } catch (error) {
        await transaction.rollback();
        console.error('ERROR: ', error);
    }

    try {
        let user = await userTabel.findOne({ where: { username: req.user.username }});
        console.log("\nUHUH\n")
        if (user) {
            let form = await formTabel.findOne({ where: { name: formname }});
            if (form) {
                form.userId = user.id;
                await form.save();
                console.log(`SUCCESS: Linked user ${user.username} with form ${form.name}`);
            } else {
                console.log(`ERROR: Form ${formname} not found`);
            }
        } else {
            console.log(`ERROR: User ${req.user.username} not found`);
        }
    } catch (error) {
        console.error('ERROR: ', error)
    }

    res.redirect("/form")
});

let messages = [];

function getFile() {
    try {
      const messagesData = fs.readFileSync(messagesFilePath, 'utf8');
      messages = JSON.parse(messagesData);
    } catch (err) {
      console.error('Error reading messages.json:', err);
    }
}

setInterval(getFile, 1000);

router.get("/chats", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 4;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    const paginatedForms = messages.slice(startIndex, endIndex);
    res.json(paginatedForms);
});

router.get("/chats/:id", async (req, res) => {
    const id = req.params.id;
    const filteredChats = messages.filter(chat => chat.formid === id);

    if (filteredChats.length > 0) {
        res.json({ messages: filteredChats, currentUser: req.user.username, currentUserPic: req.user.image });
    } else {
        res.status(404).json({ error: "No messages found for this form ID." });
    }
});

router.get("/:id", async (req, res) => {
    if(req.user) {
        const formsData = await getUsersWithFormsData();
        const id = req.params.id;
        if (!isNaN(id)) {
            const index = parseInt(id);
            let fvalue = formsData.find(form => form.id === index);
            if (fvalue) {
                res.render("chat", { layout: 'chat', form: fvalue });
            } else {
                res.status("404").render("error", { error: "User not found." });
            }
        } else {
            console.error("Invalid ID:", id);
            res.status(400).render("error", { error: "Invalid Id." });
        }
    }else {
        res.redirect("/users/req")
    }
});

module.exports = router;