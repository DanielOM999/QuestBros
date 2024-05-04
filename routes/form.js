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
    {
        "id": 5,
        "name": "Isabella Johnson",
        "email": "isabella.johnson@example.com",
        "description": "Passionate ghost hunter with a keen interest in paranormal investigations.",
        "profilePic": "/Isabella.jpg",
        "formName": "Ghost Hunting Expeditions",
        "formDesc": "Embark on ghost hunting expeditions, explore haunted locations, and document paranormal activity.",
        "tags": "ghost-hunting,paranormal,investigations"
    },
    {
        "id": 6,
        "name": "Nathan Roberts",
        "email": "nathan.roberts@example.com",
        "description": "Enthusiast of paranormal events and seeker of unexplained phenomena.",
        "profilePic": "/Nathan.jpg",
        "formName": "Paranormal Conferences",
        "formDesc": "Attend paranormal conferences, participate in discussions, and learn from experts in the field.",
        "tags": "paranormal-events,conferences,phenomena"
    },
    {
        "id": 7,
        "name": "Olivia White",
        "email": "olivia.white@example.com",
        "description": "Dedicated to uncovering the truth behind paranormal mysteries.",
        "profilePic": "/Olivia.jpg",
        "formName": "Haunted History Tours",
        "formDesc": "Join haunted history tours, explore haunted landmarks, and hear chilling tales of ghostly encounters.",
        "tags": "haunted-tours,history,ghost-stories"
    },
    {
        "id": 8,
        "name": "Ethan Brown",
        "email": "ethan.brown@example.com",
        "description": "Enthusiastic investigator of the supernatural, always ready to explore new mysteries.",
        "profilePic": "/Ethan.png",
        "formName": "Supernatural Investigations",
        "formDesc": "Conduct investigations into supernatural phenomena, analyze evidence, and seek answers to the unexplained.",
        "tags": "supernatural,investigations,paranormal"
    },
    {
        "id": 9,
        "name": "Ava Martinez",
        "email": "ava.martinez@example.com",
        "description": "Fascinated by the unknown and eager to share discoveries with fellow enthusiasts.",
        "profilePic": "/Ava.jpg",
        "formName": "Cryptid Encounters",
        "formDesc": "Discuss encounters with cryptids, share sightings, and explore the lore surrounding mysterious creatures.",
        "tags": "cryptids,creatures,mysteries"
    },
    {
        "id": 10,
        "name": "Liam Wilson",
        "email": "liam.wilson@example.com",
        "description": "Adventurous spirit with a passion for exploring the paranormal.",
        "profilePic": "/Liam.jpg",
        "formName": "Haunted Explorations",
        "formDesc": "Embark on haunted explorations, visit eerie locations, and document supernatural phenomena.",
        "tags": "haunted,explorations,paranormal"
    }
];

router.get("/", (req, res) => {
    res.render("form", { forms: forms });
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    if (!isNaN(id)) {
        const index = parseInt(id);
        let fvalue = forms[id - 1];
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