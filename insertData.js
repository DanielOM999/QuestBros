const { Sequelize } = require("sequelize");
const db = require('./config/database');
const userTabel = require('./models/userTabel');
const formTabel = require('./models/formTabel');
const crypto = require('crypto');

const users = [
    { username: 'Alex Smith', kontakt: "alex.smith@example.com", password: '4321', image: '/alexSmith.jpg', description: 'Exploring the mysteries of the unknown, one conversation at a time.' },
    { username: 'Sophia Garcia', kontakt: "sophia.garcia@example.com", password: '4321', image: '/spophiaGarcia.jpg', description: 'Curious explorer of the unexplained, ready to delve into the world of mysteries.' },
    { username: 'Emily Davis', kontakt: "emily.davis@example.com", password: '4321', image: '/emilyDavis.jpg', description: 'Passionate about the paranormal and eager to share experiences.' },
    { username: 'James Thompson', kontakt: "james@example.com", password: '4321', image: '/jamesThomson.jpg', description: 'Seeking answers in the realm of the supernatural, open to discussing.' },
    { username: 'Isabella Johnson', kontakt: "isabella.johnson@example.com", password: '4321', image: '/Isabella.jpg', description: 'Passionate ghost hunter with a keen interest in paranormal investigations.' },
    { username: 'Nathan Roberts', kontakt: "nathan.roberts@example.com", password: '4321', image: '/Nathan.jpg', description: 'Enthusiast of paranormal events and seeker of unexplained phenomena.' },
    { username: 'Olivia White', kontakt: "olivia.white@example.com", password: '4321', image: '/Olivia.jpg', description: 'Dedicated to uncovering the truth behind paranormal mysteries.' },
    { username: 'Ethan Brown', kontakt: "ethan.brown@example.com", password: '4321', image: '/Ethan.png', description: 'Enthusiastic investigator of the supernatural, always ready to explore new mysteries.' },
    { username: 'Ava Martinez', kontakt: "ava.martinez@example.com", password: '4321', image: '/Ava.jpg', description: 'Fascinated by the unknown and eager to share discoveries with fellow enthusiasts.' },
    { username: 'Liam Wilson', kontakt: "liam.wilson@example.com", password: '4321', image: '/Liam.jpg', description: 'Adventurous spirit with a passion for exploring the paranormal.' }
];

const formsL = [
    { name: 'Haunted Locations', description: "Join discussions about infamous haunted locations, share personal experiences, and uncover the secrets behind paranormal hotspots.", tags: 'hunting,paranormal,stories' },
    { name: 'Psychic Readings', description: "Connect with others interested in psychic phenomena, share experiences with readings, and explore the realms of intuition and extrasensory perception.", tags: 'hunting,paranormal,stories' },
    { name: 'UFO Sightings', description: "Dive into conversations about unidentified flying objects, analyze sighting reports, and speculate about the possibility of alien contact.", tags: 'hunting,paranormal,stories' },
    { name: 'Ghost Stories', description: "Gather around the virtual campfire to exchange ghostly tales, discuss supernatural encounters, and explore the mysteries of the spirit world.", tags: 'hunting,paranormal,stories' },
    { name: 'Ghost Hunting Expeditions', description: "Embark on ghost hunting expeditions, explore haunted locations, and document paranormal activity.", tags: 'ghost-hunting,paranormal,investigations' },
    { name: 'Paranormal Conferences', description: "Attend paranormal conferences, participate in discussions, and learn from experts in the field.", tags: 'paranormal-events,conferences,phenomena' },
    { name: 'Haunted History Tours', description: "Join haunted history tours, explore haunted landmarks, and hear chilling tales of ghostly encounters.", tags: 'haunted-tours,history,ghost-stories' },
    { name: 'Supernatural Investigations', description: "Conduct investigations into supernatural phenomena, analyze evidence, and seek answers to the unexplained.", tags: 'supernatural,investigations,paranormal' },
    { name: 'Cryptid Encounters', description: "Discuss encounters with cryptids, share sightings, and explore the lore surrounding mysterious creatures.", tags: 'cryptids,creatures,mysteries' },
    { name: 'Haunted Explorations', description: "Embark on haunted explorations, visit eerie locations, and document supernatural phenomena.", tags: 'haunted,explorations,paranormal' }
];

async function relations(users, formsL) {
    // for (let index in users) {
    //     let user = await userTabel.findOne({ where: { username: users[index].username }});
    //     let form = await formTabel.findOne({ where: { name: formsL[index].name }});
    //     if (user && form) {
    //         await user.addForm(form);
    //     }
    // }
    let user = await userTabel.findOne({ where: { username: 'Alex Smith' }});
    let form = await formTabel.findOne({ where: { name: 'Haunted Locations' }});
    console.log(Object.keys(formTabel.__proto__));
    form.userId = user.id;
    await form.save()
    console.log("SUCESS");
}


const insertData = async () => {
    const transaction = await db.transaction();
    try {
        await userTabel.destroy({ where: {}, transaction });
        await formTabel.destroy({ where: {}, transaction });

        await Promise.all(users.map(async userData => {
            let salt = crypto.randomBytes(16);
            const hashedPassword = await new Promise((resolve, reject) => {
                crypto.pbkdf2(userData.password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
                    if (err) reject(err);
                    else resolve(hashedPassword);
                });
            });

            const user = await userTabel.create({
                username: userData.username,
                kontakt: userData.kontakt,
                password: hashedPassword,
                salt: salt,
                image: userData.image,
                description: userData.description
            }, { transaction });
        }));

        await Promise.all(formsL.map(async (formData) => {
            await formTabel.create({
                name: formData.name,
                description: formData.description,
                tags: formData.tags
            }, { transaction });
        }));

        await transaction.commit();
        console.log('Data inserted successfully');
    } catch (error) {
        await transaction.rollback();
        console.error('Error inserting data:', error);
    }
    relations()
};

insertData();
