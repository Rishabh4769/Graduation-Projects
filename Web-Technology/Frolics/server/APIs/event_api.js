const event = require('../models/Event');
const router = require('express').Router();

router.get('/', async (req,res)=>{
    try {
        const events = await event.find();
        res.status(200).json(events);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id', async (req,res)=>{
    try {
        const eventItem = await event.findById(req.params.id);
        res.status(200).json(eventItem);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req,res)=>{
    const Event = new event({
        eventName: req.body.eventName,
        eventTagline: req.body.eventTagline,
        eventImage: req.body.eventImage,
        eventDescription: req.body.eventDescription,
        groupMinParticipants: req.body.groupMinParticipants,
        groupMaxParticipants: req.body.groupMaxParticipants,
        eventFees: req.body.eventFees,
        eventFirstPrize: req.body.eventFirstPrize,
        eventSecondPrize: req.body.eventSecondPrize,
        eventThirdPrize: req.body.eventThirdPrize,
        departmentId: req.body.departmentId,
        eventCoordinatorId: req.body.eventCoordinatorId,
        eventMainStudentCoordinatorName: req.body.eventMainStudentCoordinatorName,
        eventMainStudentCoordinatorPhone: req.body.eventMainStudentCoordinatorPhone,
        eventLocation: req.body.eventLocation,
        maxGroupsAllowed: req.body.maxGroupsAllowed,
    })
    try {
        const savedEvent = await Event.save();
        res.status(200).json(savedEvent);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/:id', async (req,res)=>{
    try {
        const updatedEvent = await event.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async (req,res)=>{
    try {
        await event.findByIdAndDelete(req.params.id);
        res.status(200).json("Event has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;