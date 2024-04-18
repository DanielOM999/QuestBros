const express = require("express");
const router = express.Router()
const userTabel = require("../models/userTabel");

let users = [{ name: "Kyle", lName: "Folders" }, { name: "Sally", lName: "Frontera" }];

router.get("/", (req, res) => {
    res.render("register");
});

router.post("/", async (req, res) => {
    const { firstName, lastName } = req.body;

    try {
        const newUser = await userTabel.create({ firstName, lastName });
        res.redirect(`/users/${newUser.id}`);
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).render("error", { error: "Error creating user: " + err.message });
    }
});

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const regex = /^\d+$/;

    try {

        if (!regex.test(userId)) {
            res.status(400).render("error", { error: "Invalid userId format. Only integers are allowed." });
            return;
        }

        const user = await userTabel.findByPk(userId);
        if (user) {
            res.render("userDetails", { firstName: user.firstName, lastName: user.lastName });
        } else {
            res.status(404).render("error", { error: "User not found" });
        }
    } catch (err) {
        console.error("Error retrieving user:", err);
        res.status(500).render("error", { error: "Error retrieving user: " + err.message });
    }
});



module.exports = router;