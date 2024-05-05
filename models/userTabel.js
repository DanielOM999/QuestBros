const { Sequelize, DataType } = require("sequelize");
const db = require("../config/database");
const crypto = require("crypto");

const userTabel = db.define(
  "userTabel", 
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    salt: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "userTabel"
  }
);

const createDefaultUser = async (username, password, image, description) => {
  try {
    const salt = crypto.randomBytes(16);
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashed) => {
        if (err) reject(err);
        resolve(hashed);
      });
    });

    await userTabel.findOrCreate({
      where: { username: username },
      defaults: {
        password: hashedPassword,
        salt: salt,
        image: image,
        description: description
      }
    });
    console.log(`User created/updated: ${username}`);
  } catch (err) {
    console.error('Error creating default user:', err);
  }
};

const defaultUsers = [
  { username: 'Alex Smith', password: '4321', image: '/alexSmith.jpg', description: 'Exploring the mysteries of the unknown, one conversation at a time.' },
  { username: 'Sophia Garcia', password: '4321', image: '/spophiaGarcia.jpg', description: 'Curious explorer of the unexplained, ready to delve into the world of mysteries.' },
  { username: 'Emily Davis', password: '4321', image: '/emilyDavis.jpg', description: 'Passionate about the paranormal and eager to share experiences.' },
  { username: 'James Thompson', password: '4321', image: '/jamesThomson.jpg', description: 'Seeking answers in the realm of the supernatural, open to discussing.' },
  { username: 'Isabella Johnson', password: '4321', image: '/Isabella.jpg', description: 'Passionate ghost hunter with a keen interest in paranormal investigations.' },
  { username: 'Nathan Roberts', password: '4321', image: '/Nathan.jpg', description: 'Enthusiast of paranormal events and seeker of unexplained phenomena.' },
  { username: 'Olivia White', password: '4321', image: '/Olivia.jpg', description: 'Dedicated to uncovering the truth behind paranormal mysteries.' },
  { username: 'Ethan Brown', password: '4321', image: '/Ethan.png', description: 'Enthusiastic investigator of the supernatural, always ready to explore new mysteries.' },
  { username: 'Ava Martinez', password: '4321', image: '/Ava.jpg', description: 'Fascinated by the unknown and eager to share discoveries with fellow enthusiasts.' },
  { username: 'Liam Wilson', password: '4321', image: '/Liam.jpg', description: 'Adventurous spirit with a passion for exploring the paranormal.' },
];

const createDefaultUsers = async () => {
  for (const user of defaultUsers) {
    await createDefaultUser(user.username, user.password, user.image, user.description);
  }
};

db.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized.');
    return createDefaultUsers();
  })
  .then(() => {
    console.log('Default users created/updated.');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = userTabel;
