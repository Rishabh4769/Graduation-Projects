require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

const Event = require('../models/Event');
const Group = require('../models/Group');
const Winner = require('../models/Winner');

async function seedEventWinners() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(uri);

  const events = await Event.find().sort({ createdAt: 1 });
  const groups = await Group.find().sort({ createdAt: 1 });
  const existingWinners = await Winner.find();

  const existingWinnerKeys = new Set(
    existingWinners.map((winner) => `${String(winner.eventId)}:${String(winner.groupId)}:${winner.sequence}`)
  );

  let insertedCount = 0;

  for (const event of events) {
    const eventGroups = groups.filter((group) => String(group.eventId) === String(event._id));
    if (eventGroups.length === 0) {
      continue;
    }

    const topGroups = eventGroups.slice(0, Math.min(3, eventGroups.length));

    for (let index = 0; index < topGroups.length; index += 1) {
      const sequence = index + 1;
      const group = topGroups[index];
      const winnerKey = `${String(event._id)}:${String(group._id)}:${sequence}`;

      if (existingWinnerKeys.has(winnerKey)) {
        continue;
      }

      await Winner.create({
        eventId: event._id,
        groupId: group._id,
        sequence,
        createdBy: group.createdBy,
        modifiedBy: group.modifiedBy,
      });

      existingWinnerKeys.add(winnerKey);
      insertedCount += 1;
      console.log(`Inserted winner for event "${event.eventName}" with group "${group.groupName}" at position ${sequence}`);
    }
  }

  console.log(`Seed completed. Inserted ${insertedCount} winner records.`);
}

seedEventWinners()
  .catch((error) => {
    console.error('Failed to seed event winners:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
