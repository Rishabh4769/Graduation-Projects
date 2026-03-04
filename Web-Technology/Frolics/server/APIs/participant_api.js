const participant_model = require('../models/Participant');
const router = require('express').Router();

router.get('/', async (req,res)=>{
    try {
        const participants = await participant_model.find();
        res.status(200).json(participants);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id', async (req,res)=>{
    try {
        const participant = await participant_model.findById(req.params.id);
        res.status(200).json(participant);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req,res)=>{
    const Participant = new participant_model({
        participantName: req.body.participantName,
        participantEnrollmentNumber: req.body.participantEnrollmentNumber,
        participantInstituteName: req.body.participantInstituteName,
        participantCity: req.body.participantCity,
        participantMobile: req.body.participantMobile,
        participantEmail: req.body.participantEmail,
        isGroupLeader: req.body.isGroupLeader,
        groupId: req.body.groupId,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy,
    })
    try {
        const savedParticipant = await Participant.save();
        res.status(200).json(savedParticipant);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/:id', async (req,res)=>{
    try {
        const updatedParticipant = await participant_model.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedParticipant);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async (req,res)=>{
    try {
        await participant_model.findByIdAndDelete(req.params.id);
        res.status(200).json("Participant has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;