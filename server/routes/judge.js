const express = require('express');
const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const router = express.Router();
const { runCode, SUPPORTED_LANGUAGES } = require('../utils/runCode');

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const JUDGE0_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

// Get supported languages (only the 5 we want)
router.get('/languages', async (req, res) => {
  try {
    // Return only our supported languages
    const supportedLanguages = Object.entries(SUPPORTED_LANGUAGES).map(([id, name]) => ({
      id: parseInt(id),
      name: name
    }));
    
    res.json(supportedLanguages);
  } catch (err) {
    console.error('Error fetching languages:', err);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

// Run code route using batch submission
router.post('/run', async (req, res) => {
  const { sourceCode, testCases, languageId } = req.body;

  if (!sourceCode || !Array.isArray(testCases) || !languageId) {
    return res
      .status(400)
      .json({ error: 'Missing sourceCode, testCases, or languageId' });
  }

  // Validate language ID
  if (!SUPPORTED_LANGUAGES[languageId]) {
    return res
      .status(400)
      .json({ 
        error: `Unsupported language ID: ${languageId}. Supported languages: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}` 
      });
  }

  try {
    console.log(`📝 Processing code execution request for language ID: ${languageId}`);
    const result = await runCode(sourceCode, testCases, languageId);
    res.json(result);
  } catch (err) {
    console.error('❌ Backend runCode error:', err.message);
    res.status(500).json({ error: err.message || 'Code execution failed' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    supportedLanguages: Object.keys(SUPPORTED_LANGUAGES).length,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
