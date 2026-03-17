const Group = require('../models/Group');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    const groups = await Group.find(filter);
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', async (req, res) => {
  try {
    const creatorId = req.body.createdBy;

    if (creatorId) {
      const existingCount = await Group.countDocuments({ createdBy: creatorId });
      if (existingCount >= 5) {
        return res.status(403).json({ message: 'Group creation limit reached (max 5 per user).' });
      }
    }

    const group = new Group({
      groupName: req.body.groupName,
      eventId: req.body.eventId,
      isPaymentDone: req.body.isPaymentDone || false,
      isPresent: req.body.isPresent || false,
      createdBy: creatorId,
      modifiedBy: req.body.modifiedBy || creatorId,
    });

    const saved = await group.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Group.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.status(200).json('Group deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
