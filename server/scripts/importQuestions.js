const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const path = require('path');
const Question = require('../models/Question');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

function importQuestions() {
  const results = [];

  fs.createReadStream(path.resolve(__dirname, '../data/interview_questions.csv'))
    .pipe(csv())
    .on('data', (row) => {
      let parsedTestCases = [];

      try {
        parsedTestCases = JSON.parse(row.testCases?.trim() || '[]');
      } catch (err) {
        console.warn(`⚠️ Failed to parse testCases for: ${row.title}`);
      }

      results.push({
        title: row.title,
        description: row.description,
        starterCode: row.starterCode || '',
        constraints: row.constraints || '',
        testCases: parsedTestCases,
      });
    })
    .on('end', async () => {
      try {
        await Question.deleteMany(); // Clears old questions
        await Question.insertMany(results);
        console.log('✅ Questions imported successfully!');
      } catch (err) {
        console.error('❌ Error importing questions:', err);
      } finally {
        mongoose.disconnect();
      }
    });
}

importQuestions();
