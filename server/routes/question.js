const express=require('express');
const router=express.Router();
const Question=require('../models/Question');

router.get('/', async(req,res) => {
    try{
        const questions=await Question.find().limit(2);
        res.json(questions);
    }catch(err){
        res.status(500).json({message: "Failed to fetch questions!"});
    }
});

module.exports=router;