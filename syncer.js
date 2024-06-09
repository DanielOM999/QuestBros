const { db } = require('./models/Index');

const synchronizeDatabase = async () => {
  try {
    await db.sync({ force: true });
    console.log('Database synchronized.');
  } catch (err) {
    console.error('Error synchronizing database:', err);
    throw err;
  }
};

module.exports = synchronizeDatabase;
