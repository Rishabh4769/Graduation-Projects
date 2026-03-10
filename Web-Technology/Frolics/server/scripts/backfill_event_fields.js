require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Event = require('../models/Event');

async function backfillEventFields() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const events = await Event.find();
  let updatedCount = 0;

  for (let index = 0; index < events.length; index += 1) {
    const item = events[index];
    let shouldSave = false;

    if (!item.eventStatus) {
      item.eventStatus = 'upcoming';
      shouldSave = true;
    }

    if (!item.eventDate) {
      item.eventDate = item.createdAt || new Date();
      shouldSave = true;
    }

    if (shouldSave) {
      await item.save();
      updatedCount += 1;
      console.log(`Updated event "${item.eventName}"`);
    }
  }

  console.log(`Backfill complete. Updated ${updatedCount} events.`);
}

backfillEventFields()
  .catch((error) => {
    console.error('Failed to backfill event fields:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
