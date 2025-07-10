import cron from 'node-cron';

// Runs every day at 7:00 AM
cron.schedule('0 7 * * *', () => {
  import('./sendNewsletter.js');
});
