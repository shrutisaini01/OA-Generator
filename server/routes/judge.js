const express=require('express');
const axios=require('axios');
require('dotenv').config();
const router=express.Router();

const RAPID_API_KEY=process.env.RAPID_API_KEY;
const JUDGE0_HOST = 'judge0-ce.p.rapidapi.com';

router.get('/languages', async(req,res) => {
    try{
        const response=await axios.get(`https://${JUDGE0_HOST}/languages`,{
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': JUDGE0_HOST
            }
        });
        res.json(response.data);
    }catch(err){
        console.error("Error fetching languages: ",err);
        res.status(500).json({ error: 'Failed to fetch languages' });
    }
});

module.exports=router;