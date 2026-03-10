const institutes = require('../models/Institute');
const router = require('express').Router();

router.get('/', async (req,res)=>{
    try {
        const institutesList = await institutes.find();
        res.status(200).json(institutesList);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id', async (req,res)=>{
    try {
        const institute = await institutes.findById(req.params.id);
        res.status(200).json(institute);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req,res)=>{
    const Institute = new institutes({
        instituteName: req.body.instituteName,
        instituteImage: req.body.instituteImage,
        instituteDescription: req.body.instituteDescription || req.body.institituteDescription,
        instituteCoordinatorId: req.body.instituteCoordinatorId || undefined,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy,
    })
    try {
        const savedInstitute = await Institute.save();
        res.status(200).json(savedInstitute);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/:id', async (req,res)=>{
    try {
        const payload = { ...req.body };
        if (!payload.instituteCoordinatorId) {
            delete payload.instituteCoordinatorId;
        }
        if (!payload.instituteImage) {
            delete payload.instituteImage;
        }
        if (!payload.instituteDescription && payload.institituteDescription) {
            payload.instituteDescription = payload.institituteDescription;
        }
        delete payload.institituteDescription;

        const updatedInstitute = await institutes.findByIdAndUpdate(
            req.params.id,
            {
                $set: payload,
            },
            { new: true }
        );
        res.status(200).json(updatedInstitute);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async (req,res)=>{
    try {
        await institutes.findByIdAndDelete(req.params.id);
        res.status(200).json("Institute has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
