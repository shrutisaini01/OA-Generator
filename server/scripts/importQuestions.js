const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config({ path: __dirname + '/../.env' });

const MONGO_URI=process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

function importQuestions() {
  const results = [];

  fs.createReadStream('../data/interview_questions.csv')
    .pipe(csv())
    .on('data', (row) => {
      results.push({
        title: row.title,
        description: row.description,
        aiSolution: row.solution,
        starterCode: '',
        constraints: '',
        testCases: [], // You’ll fill these in later or via AI
      });
    })
    .on('end', async () => {
      try {
        await Question.insertMany(results);
        console.log('✅ Questions imported successfully!');
        mongoose.disconnect();
      } catch (err) {
        console.error('❌ Error importing questions:', err);
      }
    });
}

importQuestions();
