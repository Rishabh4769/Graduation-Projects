const User = require("../models/User");
const router = require("express").Router();

// User API Endpoints for ADMIN
router.get("/",async (req,res)=>{
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.json({message:err});
    }
})

router.get("/:id",async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.json(user);
    }catch(err){
        res.json({message:err});
    }
})

// get user by email
router.get("/email/:email",async (req,res)=>{
    try{
        const user = await User.findOne({emailAddress: req.params.email});
        res.json(user);
    }catch(err){
        res.json({message:err});
    }
})

router.post("/",async (req,res)=>{
    const newUser = new User({
        userName: req.body.userName || req.body.name,
        emailAddress: req.body.emailAddress || req.body.email,
        userPassword: req.body.userPassword || req.body.password,
        role: req.body.role
    });
    try{
        const savedUser = await newUser.save();
        res.json(savedUser);
    }catch(err){
        res.status(400).json({ error: err.message });
    }
})

router.put("/:id",async (req,res)=>{
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body);
        res.json(updatedUser);
    }catch(err){
        res.json({message:err});
    }
})

router.delete("/:id",async (req,res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    }catch(err){
        res.json({message:err});
    }
})

module.exports = router;