const express = require("express");
let crypto = require("crypto");
let passport = require("passport");
let LocalStrategy = require("passport-local");
const userTabel = require("../models/userTabel");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const router = express.Router();

const forms = [
    { "id": 1, 
        "name": "Alex Smith", 
        "email": "alex.smith@example.com", 
        "description": "Exploring the mysteries of the unknown, one conversation at a time.",
        "profilePic": "/alexSmith.jpg",
        "formName": "Haunted Locations",
        "formDesc": "Join discussions about infamous haunted locations, share personal experiences, and uncover the secrets behind paranormal hotspots.",
        "tags": "hunting,paranormal,stories"
    },
    { "id": 2, 
        "name": "Sophia Garcia", 
        "email": "sophia.garcia@example.com", 
        "description": "Curious explorer of the unexplained, ready to delve into the world of mysteries.",
        "profilePic": "/spophiaGarcia.jpg",
        "formName": "Psychic Readings",
        "formDesc": "Connect with others interested in psychic phenomena, share experiences with readings, and explore the realms of intuition and extrasensory perception.",
        "tags": "hunting,paranormal,stories"
    },
    { "id": 3, 
        "name": "Emily Davis", 
        "email": "emily.davis@example.com", 
        "description": "Passionate about the paranormal and eager to share experiences.",
        "profilePic": "/emilyDavis.jpg",
        "formName": "UFO Sightings",
        "formDesc": "Dive into conversations about unidentified flying objects, analyze sighting reports, and speculate about the possibility of alien contact.",
        "tags": "hunting,paranormal,stories"
    },
    { "id": 4, 
        "name": "James Thompson", 
        "email": "james@example.com", 
        "description": "Seeking answers in the realm of the supernatural, open to discussing.",
        "profilePic": "/jamesThomson.jpg",
        "formName": "Ghost Stories",
        "formDesc": "Gather around the virtual campfire to exchange ghostly tales, discuss supernatural encounters, and explore the mysteries of the spirit world.",
        "tags": "hunting,paranormal,stories"
    },
];

router.get("/", (req, res) => {
    res.render("form")
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const index = parseInt(id);
        res.render("form-search", { id: id });
    } else {
        console.error("Invalid ID:", id);
        res.status(400).render("error", { error: "Invalid Id." });
    }
});

module.exports = router;