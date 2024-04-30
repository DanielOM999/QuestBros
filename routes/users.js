const express = require("express");
let crypto = require("crypto");
let passport = require("passport");
let LocalStrategy = require("passport-local");
const userTabel = require("../models/userTabel");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Images")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|jpg|png|gif/
        const mimeType = fileType.test(file.mimetype)
        const textname = fileType.test(path.extname(file.originalname))

        if (mimeType && textname) {
            return cb(null, true)
        }
        cb("File must be PNG, JPG or GIF")
        
    }
}).single("image")

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
    failureRedirect: "/users/req?failed=1"
}))

router.post("/signup", (req, res) => {
    let salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256", async function(err, hashedPassword) {
        if (err) {res.redirect("/users/req?failed=1")}

        try {
            const user = await userTabel.create({username: req.body.username, password: hashedPassword, salt: salt})

            req.login(user, function(err) {
                if (err) {res.redirect("/users/req?failed=3")}
                res.redirect("/users")
            })
        } catch (err) {
            res.redirect("/users/req?failed=2")
            console.log(err)
        }
    })
});

router.get("/req", (req, res) => {
    const failed = req.query.failed;
    let msg = "";

    if (failed === "1") {
        msg = "Incorrect username or password.";
    } else if (failed === "2") {
        msg = "The username is already taken.";
    } else if (failed === "3") {
        msg = "Failed to login.";
    }
    res.render("tlogin", { message: msg, layout: "user"  });
});

router.post("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.redirect("/users/req")
    })
});

router.post("/uploadProfilePic", upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).redirect("/users?failed=1");
        }

        console.log("File uploaded:", req.file);

        const user = await userTabel.findOne({ where: { username: req.user.username } });
        if (!user) {
            return res.status(404).redirect("/users?failed=2");
        }

        if (user.image) {
            fs.unlinkSync(user.image);
        }

        user.image = req.file.path;
        await user.save();

        res.status(200).redirect("/users");
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).redirect("/users?failed=3");
    }
});

router.get("/", (req, res) => {
    try {
        if(req.user) {
            let profilePicURL;
            const failed = req.query.failed;
            let msg = "";
            if (req.user.image) {
                profilePicURL = req.user.image;
            }else {
                profilePicURL = "/profile.png"
            }

            if (failed === "1") {
                msg = "Nothing has changed";
            } else if (failed === "2") {
                msg = "User not found.";
            } else if (failed === "3") {
                msg = "Error uploading file.";
            } else if (failed === "4") {
                msg = "File must be png, jpg or gif.";
            }
            
            res.render("userDetails", { username: req.user.username, profilePicURL: profilePicURL, message: msg });
        } else {
            res.redirect("/users/req")
        }
    } catch (err) {
        console.log(err)
        res.status(404).render("error", { error: "User not found" });
    }
});

module.exports = router;