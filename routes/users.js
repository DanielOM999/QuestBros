const express = require("express");
let crypto = require("crypto");
let passport = require("passport");
let LocalStrategy = require("passport-local");
const userTabel = require("../models/userTabel");
const router = express.Router();

passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        const user = await userTabel.findOne({ where: { username: username } });
        if (!user) {
            return done(null, false, { message: "Incorrect username or password." })
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", async function(err, hashedPassword){
            if (err) {return done(err)}

            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                return done(null, false, { message: "Incorrect username or password." })
            }

            return done(null, user);
        })

    } catch (err) {
        return done(err);
    }
}))

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    userTabel.findByPk(id).then(function(user) {done(null, user); });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/users/login?failed=1"
}))

router.get("/login", (req, res) => {
    const failed = req.query.failed
    let msg
    if (failed == "1") {
        msg = "Incorrect username or password."
    }
    res.render("loging", { message: msg });
});

router.post("/signup", (req, res) => {
    let salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", async function(err, hashedPassword) {
        if (err) {res.redirect("/users/register?failed=1")}

        try {
            const user = await userTabel.create({username: req.body.username, password: hashedPassword, salt: salt})

            req.login(user, function(err) {
                if (err) {res.redirect("/users/register?failed=3")}
                res.redirect("/users")
            })
        } catch (err) {
            res.redirect("/users/register?failed=2")
            console.log(err)
        }
    })
});

router.get("/register", (req, res) => {
    const failed = req.query.failed

    let msg = ""
    switch (failed) {
        case "1":
            msg = "The cryptation went wrong."
            break;
        case "2":
            msg = "The username is already taken."
        case "3":
            msg = "Failed to login."
    }
    res.render("register", { error: msg });

});

router.post("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.redirect("/users/login")
    })
});


router.get("/", (req, res) => {
    try {
        res.render("userDetails", { username: req.user.username });
    } catch (err) {
        console.log(err)
        res.status(404).render("error", { error: "User not found" });
    }
});

module.exports = router;