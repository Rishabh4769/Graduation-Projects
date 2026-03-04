const User = require("../models/User");
const router = require("express").Router();

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

router.get("/email/:email",async (req,res)=>{
    try{
        const user = await User.findOne({emailAddress: req.params.email});
        res.json(user);
    }catch(err){
        res.json({message:err});
    }
})

router.post("/",async (req,res)=>{
    try{
        const plain = req.body.userPassword || req.body.password;
        const bcrypt = require('bcryptjs');
        const hashed = plain ? await bcrypt.hash(plain, 10) : undefined;

        const newUser = new User({
            userName: req.body.userName || req.body.name,
            emailAddress: req.body.emailAddress || req.body.email,
            userPassword: hashed || req.body.userPassword || req.body.password,
            role: req.body.role
        });

        const savedUser = await newUser.save();
        const safe = { id: savedUser._id, userName: savedUser.userName, email: savedUser.emailAddress, role: savedUser.role };
        res.json(safe);
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