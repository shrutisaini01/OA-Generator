const express=require('express');
const router=express.Router();
const User=require('../models/User');

router.post('/signup', async(req,res) => {
    const {username,password,name,college,provider}=req.body;
    try{
        let existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "User already exists!"});
        }
        const newUser=new User({username,password,name,college,provider});
        await(newUser.save());
        res.status(201).json({message:"User created successfully!", user: newUser});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server Error!"});
    }
});

router.post('/signin',async(req,res) => {
    const {username, password}=req.body;
    try{
        const user=await User.findOne({username});
        if(!user) return res.status(404).json({message: "User does not exist!"});
        if(user.password!==password){
            return res.status(401).json({message: "Incorrect password!"});
        }
        res.status(200).json({message: "Login successful!",user});
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error!"});
    }
});

module.exports=router;