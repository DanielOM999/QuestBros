const { db, userTabel, formTabel } = require('./models/Index');
const crypto = require("crypto");

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

    await userTabel.findOrCreate({
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

const createDefaultForm = async (name, description, tags) => {
  try {
    await formTabel.findOrCreate({
      where: { name },
      defaults: {
        description,
        tags
      }
    });
    console.log(`Form created/updated: ${name}`);
  } catch (err) {
    console.error('Error creating default form:', err);
  }
};

const defaultForms = [
  { name: 'Haunted Locations', description: "Join discussions about infamous haunted locations, share personal experiences, and uncover the secrets behind paranormal hotspots.", tags: 'hunting,paranormal,stories' },
  { name: 'Psychic Readings', description: "Connect with others interested in psychic phenomena, share experiences with readings, and explore the realms of intuition and extrasensory perception.", tags: 'hunting,paranormal,stories' },
  { name: 'UFO Sightings', description: "Dive into conversations about unidentified flying objects, analyze sighting reports, and speculate about the possibility of alien contact.", tags: 'hunting,paranormal,stories' },
  { name: 'Ghost Stories', description: "Gather around the virtual campfire to exchange ghostly tales, discuss supernatural encounters, and explore the mysteries of the spirit world.", tags: 'hunting,paranormal,stories' },
  { name: 'Ghost Hunting Expeditions', description: "Embark on ghost hunting expeditions, explore haunted locations, and document paranormal activity.", tags: 'ghost-hunting,paranormal,investigations' },
  { name: 'Paranormal Conferences', description: "Attend paranormal conferences, participate in discussions, and learn from experts in the field.", tags: 'paranormal-events,conferences,phenomena' },
  { name: 'Haunted History Tours', description: "Join haunted history tours, explore haunted landmarks, and hear chilling tales of ghostly encounters.", tags: 'haunted-tours,history,ghost-stories' },
  { name: 'Supernatural Investigations', description: "Conduct investigations into supernatural phenomena, analyze evidence, and seek answers to the unexplained.", tags: 'supernatural,investigations,paranormal' },
  { name: 'Cryptid Encounters', description: "Discuss encounters with cryptids, share sightings, and explore the lore surrounding mysterious creatures.", tags: 'cryptids,creatures,mysteries' },
  { name: 'Haunted Explorations', description: "Embark on haunted explorations, visit eerie locations, and document supernatural phenomena.", tags: 'haunted,explorations,paranormal' },
];

const createDefaultForms = async () => {
  try {
    await Promise.all(
      defaultForms.map(form => createDefaultForm(form.name, form.description, form.tags))
    );
    console.log('Default forms created/updated.');
  } catch (err) {
    console.error('Error creating default forms:', err);
  }
};

const synchronizeDatabase = async () => {
  try {
    await db.sync({ alter: true });
    console.log('Database synchronized.');
    await createDefaultUsers();
    await createDefaultForms();
  } catch (err) {
    console.error('Error synchronizing database:', err);
    throw err;
  }
};

module.exports = synchronizeDatabase;