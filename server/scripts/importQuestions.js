const mongoose=require('mongoose');
const fs=require('fs');
const csv=require('csv-parser');
const dotenv=require('dotenv');
const Question=require('../models/Question');

dotenv.config();

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log("Error connecting mongodb: ",err));

function importQuestions() {
    const results = [];
    fs.createReadStream('./data/interview_questions.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
        try {
            await Question.insertMany(results);
            console.log('Questions imported successfully!');
            mongoose.disconnect();
        } catch (err) {
            console.error('Error importing questions:', err);
        }
    });
}