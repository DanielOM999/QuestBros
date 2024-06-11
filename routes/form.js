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
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

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

router.get("/:id", async (req, res) => {
    const formsData = await getUsersWithFormsData();
    const id = req.params.id;
    if (!isNaN(id)) {
        const index = parseInt(id);
        let fvalue = formsData.find(form => form.id === index);
        if (fvalue) {
            res.render("form-search", { form: fvalue });
        } else {
            res.status("404").render("error", { error: "User not found." });
        }
    } else {
        console.error("Invalid ID:", id);
        res.status(400).render("error", { error: "Invalid Id." });
    }
});

module.exports = router;