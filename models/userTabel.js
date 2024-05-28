const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");
const crypto = require("crypto");

const userTable = db.define(
  "userTable", 
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    kontakt: {
      type: DataTypes.STRING,
      unique: true
    },
    salt: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "userTable"
  }
);

const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashed) => {
      if (err) reject(err);
      resolve(hashed);
    });
  });
};

const createDefaultUser = async (username, kontakt, password, image, description) => {
  try {
    const salt = crypto.randomBytes(16);
    const hashedPassword = await hashPassword(password, salt);

    await userTable.findOrCreate({
      where: { username },
      defaults: {
        kontakt: kontakt,
        password: hashedPassword,
        salt: salt,
        image,
        description
      }
    });
    console.log(`User created/updated: ${username}`);
  } catch (err) {
    console.error('Error creating default user:', err);
  }
};

const defaultUsers = [
  { username: 'Alex Smith', kontakt: "alex.smith@example.com", password: '4321', image: '/alexSmith.jpg', description: 'Exploring the mysteries of the unknown, one conversation at a time.' },
  { username: 'Sophia Garcia', kontakt: "sophia.garcia@example.com", password: '4321', image: '/spophiaGarcia.jpg', description: 'Curious explorer of the unexplained, ready to delve into the world of mysteries.' },
  { username: 'Emily Davis', kontakt: "emily.davis@example.com", password: '4321', image: '/emilyDavis.jpg', description: 'Passionate about the paranormal and eager to share experiences.' },
  { username: 'James Thompson', kontakt: "james@example.com", password: '4321', image: '/jamesThomson.jpg', description: 'Seeking answers in the realm of the supernatural, open to discussing.' },
  { username: 'Isabella Johnson', kontakt: "isabella.johnson@example.com", password: '4321', image: '/Isabella.jpg', description: 'Passionate ghost hunter with a keen interest in paranormal investigations.' },
  { username: 'Nathan Roberts', kontakt: "nathan.roberts@example.com", password: '4321', image: '/Nathan.jpg', description: 'Enthusiast of paranormal events and seeker of unexplained phenomena.' },
  { username: 'Olivia White', kontakt: "olivia.white@example.com", password: '4321', image: '/Olivia.jpg', description: 'Dedicated to uncovering the truth behind paranormal mysteries.' },
  { username: 'Ethan Brown', kontakt: "ethan.brown@example.com", password: '4321', image: '/Ethan.png', description: 'Enthusiastic investigator of the supernatural, always ready to explore new mysteries.' },
  { username: 'Ava Martinez', kontakt: "ava.martinez@example.com", password: '4321', image: '/Ava.jpg', description: 'Fascinated by the unknown and eager to share discoveries with fellow enthusiasts.' },
  { username: 'Liam Wilson', kontakt: "liam.wilson@example.com", password: '4321', image: '/Liam.jpg', description: 'Adventurous spirit with a passion for exploring the paranormal.' },
];

const createDefaultUsers = async () => {
  try {
    await Promise.all(
      defaultUsers.map(user => createDefaultUser(user.username, user.kontakt, user.password, user.image, user.description))
    );
    console.log('Default users created/updated.');
  } catch (err) {
    console.error('Error creating default users:', err);
  }
};

db.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized.');
    return createDefaultUsers();
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = userTable;
