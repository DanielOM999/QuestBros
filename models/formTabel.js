const { Sequelize, DataType } = require("sequelize");
const db = require("../config/database");

const formTabel = db.define(
  "formTabel", 
  {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: false
    }
  },
  {
    tableName: "formTabel"
  }
);

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

const defultForm = [
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
      defultForm.map(form => createDefaultForm(form.name, form.description, form.tags))
    );
    console.log('Default forms created/updated.');
  } catch (err) {
    console.error('Error creating default forms:', err);
  }
};

db.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized.');
    return createDefaultForms();
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

  module.exports = formTabel;