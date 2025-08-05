const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Supported language IDs for Judge0 API
const SUPPORTED_LANGUAGES = {
  50: 'C (GCC 9.2.0)',
  54: 'C++ (GCC 9.2.0)', 
  62: 'Java (OpenJDK 13.0.1)',
  63: 'JavaScript (Node.js 12.14.0)',
  71: 'Python (3.8.1)'
};

const runCode = async (sourceCode, testCases, languageId) => {
  // Validate inputs
  if (!sourceCode || !Array.isArray(testCases) || !languageId) {
    throw new Error('Missing sourceCode, testCases, or languageId');
  }

  if (!SUPPORTED_LANGUAGES[languageId]) {
    throw new Error(`Unsupported language ID: ${languageId}. Supported languages: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`);
  }

  if (!process.env.RAPID_API_KEY) {
    throw new Error('RAPID_API_KEY environment variable is not set');
  }

  try {
    console.log(`🚀 Executing code in ${SUPPORTED_LANGUAGES[languageId]} with ${testCases.length} test cases`);
    
    // Submit code for execution
    const submissions = testCases.map((tc) => ({
      source_code: sourceCode.trim(),
      language_id: Number(languageId),
      stdin: tc.input?.toString() || '',
      expected_output: tc.expectedOutput?.toString() || '',
    }));

    const submitResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions/batch', {
      submissions
    }, {
      params: {
        base64_encoded: 'false',
        wait: 'false', // Don't wait, we'll poll for results
      },
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com',
      },
      timeout: 10000,
    });

    if (!submitResponse.data || !Array.isArray(submitResponse.data)) {
      throw new Error('Invalid submission response from Judge0 API');
    }

    const tokens = submitResponse.data.map(sub => sub.token);
    console.log(`📝 Submitted ${tokens.length} submissions with tokens:`, tokens);

    // Poll for results
    const results = [];
    const maxAttempts = 30; // Maximum 30 attempts (30 seconds)
    let attempts = 0;

    while (results.length < tokens.length && attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}...`);
      
      // Get results for all tokens
      const tokensParam = tokens.join(',');
      const resultsResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${tokensParam}`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com',
        },
        timeout: 5000,
      });

      if (!resultsResponse.data || !Array.isArray(resultsResponse.data.submissions)) {
        throw new Error('Invalid results response from Judge0 API');
      }

      // Process results
      resultsResponse.data.submissions.forEach((sub, index) => {
        if (sub.status && sub.status.id > 2) { // Status > 2 means processing is complete
          const testCase = testCases[index];
          const actualOutput = sub.stdout || sub.stderr || sub.compile_output || '';
          
          // Check if the submission was successful
          const isAccepted = sub.status?.description === 'Accepted';
          
          // Compare outputs (case-insensitive and trim whitespace)
          const expectedTrimmed = testCase.expectedOutput?.toString().trim().toLowerCase();
          const actualTrimmed = actualOutput.trim().toLowerCase();
          const passed = isAccepted && expectedTrimmed === actualTrimmed;

          const result = {
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: actualOutput,
            status: passed ? 'Passed' : 'Failed',
            description: sub.status?.description || 'Unknown',
            executionTime: sub.time || 'N/A',
            memory: sub.memory || 'N/A',
          };

          // Only add if not already added
          if (!results.find(r => r.input === result.input)) {
            results.push(result);
          }
        }
      });

      // If all results are in, break
      if (results.length === tokens.length) {
        break;
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (results.length !== tokens.length) {
      throw new Error(`Timeout: Only got ${results.length}/${tokens.length} results after ${maxAttempts} attempts`);
    }

    const overallStatus = results.every((r) => r.status === 'Passed')
      ? 'Passed All'
      : 'Some Failed';

    console.log(`✅ Code execution completed. Status: ${overallStatus}`);

    return {
      results,
      overallStatus,
      rawOutput: results.map((r) => r.actualOutput).join('\n'),
      language: SUPPORTED_LANGUAGES[languageId],
    };
  } catch (error) {
    console.error('❌ Judge0 API Error:', error.response?.status || error.code);
    
    if (error.response) {
      console.error('📦 Response data:', error.response.data);
      
      // Handle specific Judge0 API errors
      if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (error.response.status === 400) {
        throw new Error('Invalid request to Judge0 API. Please check your code and test cases.');
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The code execution took too long.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Unable to connect to Judge0 API. Please check your internet connection.');
    }
    
    throw new Error(`Code execution failed: ${error.message}`);
  }
};

module.exports = { runCode, SUPPORTED_LANGUAGES };

