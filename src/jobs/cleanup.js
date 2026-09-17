const cron = require('node-cron');
const Task = require('../models/Task');

// Runs at 02:00 AM every day
cron.schedule('0 2 * * *', async () => {
  try {
    const result = await Task.deleteMany({ isDeleted: true });
    console.log(`Nightly Cleanup: Purged ${result.deletedCount} soft-deleted tasks.`);
  } catch (error) {
    console.error('Nightly cleanup job failed:', error);
  }
});