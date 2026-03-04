const dept = require('../models/Department');
const router = require('express').Router();

router.get('/', async (req,res)=>{
    try {
        const departments = await dept.find();
        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id', async (req,res)=>{
    try {
        const department = await dept.findById(req.params.id);
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/', async (req,res)=>{
    const Department = new dept({
        departmentName: req.body.departmentName,
        departmentImage: req.body.departmentImage,
        departmentDescription: req.body.departmentDescription,
        instituteId: req.body.instituteId,
        departmentCoordinatorId: req.body.departmentCoordinatorId,
        createdBy: req.body.createdBy,
        modifiedBy: req.body.modifiedBy,
    })
    try {
        const savedDepartment = await Department.save();
        res.status(200).json(savedDepartment);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/:id', async (req,res)=>{
    try {
        const updatedDepartment = await dept.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedDepartment);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async (req,res)=>{
    try {
        await dept.findByIdAndDelete(req.params.id);
        res.status(200).json("Department has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;