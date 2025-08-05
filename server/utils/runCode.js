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

// C++ template to wrap the user's solution for the Reverse String problem
const cppTemplate = (solutionCode) => `
#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>
#include <sstream>
#include <algorithm> // Required for std::swap if not explicitly defined

${solutionCode}

int main() {
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) {
            continue;
        }
        
        // Remove the outer brackets '[' and ']'
        if (line.length() >= 2 && line[0] == '[' && line[line.length() - 1] == ']') {
            line = line.substr(1, line.length() - 2);
        } else {
            // Handle invalid format if necessary, or assume correct format
            std::cout << "[]" << std::endl; // Output empty array for malformed input
            continue;
        }

        std::stringstream ss(line);
        std::string token;
        std::vector<char> s_vec;
        
        while (std::getline(ss, token, ',')) {
            // Each token is expected to be like "\"h\""
            // Remove leading/trailing whitespace and quotes
            token.erase(0, token.find_first_not_of(" \t\n\r"));
            token.erase(token.find_last_not_of(" \t\n\r") + 1);

            if (token.length() >= 2 && token[0] == '"' && token[token.length() - 1] == '"') {
                s_vec.push_back(token[1]); // Get the character inside quotes
            } else if (token.length() == 1) { // Handle single character without quotes if it comes
                s_vec.push_back(token[0]);
            }
        }

        Solution solution;
        solution.reverseString(s_vec); // Call the user's solution

        // Print the result in the expected format: ["o","l","l","e","h"]
        std::cout << "[";
        for (size_t i = 0; i < s_vec.size(); ++i) {
            std::cout << "\"" << s_vec[i] << "\"";
            if (i < s_vec.size() - 1) {
                std::cout << ",";
            }
        }
        std::cout << "]" << std::endl;
    }

    return 0;
}`;

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
    
    let finalSourceCode = sourceCode.trim();
    
    // If it's C++, wrap the user's code in a full program
    if (Number(languageId) === 54) { // C++
      finalSourceCode = cppTemplate(sourceCode);
    }

    // Submit code for execution
    const submissions = testCases.map((tc) => {
      let stdinInput = tc.input;
      let expectedOutputString = tc.expectedOutput;

      // For C++, we must serialize the JavaScript array to a JSON string.
      if (Number(languageId) === 54) {
        stdinInput = JSON.stringify(tc.input);
        expectedOutputString = JSON.stringify(tc.expectedOutput);
      }

      return {
        source_code: finalSourceCode,
        language_id: Number(languageId),
        stdin: stdinInput,
        expected_output: expectedOutputString,
      };
    });

    const submitResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions/batch', {
      submissions
    }, {
      params: {
        base64_encoded: 'false',
        wait: 'false',
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
    const maxAttempts = 30;
    let attempts = 0;

    while (results.length < tokens.length && attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}...`);
      
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

      resultsResponse.data.submissions.forEach((sub, index) => {
        // Check if the submission is complete (status ID > 2) and not already processed
        if (sub.status && sub.status.id > 2 && !results.some(r => r.token === sub.token)) {
          const testCase = testCases[index];
          const actualOutput = sub.stdout || sub.stderr || sub.compile_output || '';
          
          const isAccepted = sub.status?.description === 'Accepted';
          
          // Compare outputs (trim whitespace)
          const expectedTrimmed = JSON.stringify(testCase.expectedOutput);
          const actualTrimmed = actualOutput.trim();
          const passed = isAccepted && expectedTrimmed === actualTrimmed;

          const result = {
            token: sub.token, // Add token to identify processed results
            input: JSON.stringify(testCase.input),
            expectedOutput: expectedTrimmed,
            actualOutput: actualOutput,
            status: passed ? 'Passed' : 'Failed',
            description: sub.status?.description || 'Unknown',
            executionTime: sub.time || 'N/A',
            memory: sub.memory || 'N/A',
          };

          results.push(result);
        }
      });

      if (results.length === tokens.length) {
        break;
      }

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