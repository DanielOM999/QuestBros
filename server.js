const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session")
const passport = require("passport")
const app = express();

const hbs = exphbs.create({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        toLowerCase: function(str) {
            return str.toLowerCase();
        }
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "public")));
app.use("/Images", express.static("./Images"))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: "SECRETKEY", resave: true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.render("index"));
// app.get("/form", (req, res) => { 
//     res.render("form")
//     // if(req.user) {
//     //     res.render("form")
//     // }else {
//     //     res.redirect("/users/req")
//     // }
// });
app.get("/about", (req, res) => res.render("about"));
app.get("/aboutv2", (req, res) => res.render("aboutv2"));
app.get("/add", (req, res) => res.render("add"));
app.get("/test", (req, res) => res.render("test"));
// app.get("/reg", (req, res) => res.render("tlogin", { layout: "user" }))
// app.get("/login", (req, res) => res.render("loging"));
// app.get("/register", (req, res) => res.render("register"));

const userRouter = require("./routes/users");
const formRouter = require("./routes/form");

app.use("/users", userRouter)
app.use("/form", formRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));