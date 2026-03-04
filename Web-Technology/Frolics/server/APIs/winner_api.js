const winner = require('../models/Winner');
const router = require('express').Router();

router.get('/', async (req,res)=>{
    try {
        const winners = await winner.find();
        res.status(200).json(winners);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id', async (req,res)=>{
    try {
        const winnerItem = await winner.findById(req.params.id);
        res.status(200).json(winnerItem);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req,res)=>{
    const Winner = new winner({
        eventId: req.body.eventId,
        groupId: req.body.groupId,
        sequence: req.body.sequence,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy,
    })
    try {
        const savedWinner = await Winner.save();
        res.status(200).json(savedWinner);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/:id', async (req,res)=>{
    try {
        const updatedWinner = await winner.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedWinner);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async (req,res)=>{
    try {
        await winner.findByIdAndDelete(req.params.id);
        res.status(200).json("Winner has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;