const express = require("express");
const path = require("path");
const _ = require('lodash');
const { Sequelize } = require("sequelize")
const userTabel = require("../models/userTabel");
const formTabel = require("../models/formTabel");
const router = express.Router();

// async function getUsersWithFormsData() {
//   try {
//     let users = await userTabel.findAll({
//       include: [{
//         model: formTabel,
//         as: 'forms'
//       }]
//     });
//     let usersJson = users.map(user => user.toJSON());
    
//     const newJSON = usersJson.flatMap(user => {
//       return user.forms.map(form => {
//         return {
//           name: user.username,
//           email: user.kontakt,
//           description: user.description,
//           profilePic: user.image,
//           formName: form.name,
//           formDesc: form.description,
//           tags: form.tags
//         };
//       });
//     });

//     let shuffledJSON = _.shuffle(newJSON);
//     return shuffledJSON;
//   } catch (error) {
//     console.log(`Error fetching form data: ${error}`);
//     return null;
//   }
// }

// router.get("/", async (req, res) => {
//     try {
//         const formsData = await getUsersWithFormsData();
//         const page = parseInt(req.query.page) || 1;
//         const size = parseInt(req.query.size) || 4;
//         const startIndex = (page - 1) * size;
//         const endIndex = startIndex + size;

//         const paginatedForms = formsData.slice(startIndex, endIndex);
//         res.json(paginatedForms);
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch forms data' });
//       }
// });

router.get("/", async (req, res) => {
  res.render("chat", { layout: "chat" });
});

module.exports = router;