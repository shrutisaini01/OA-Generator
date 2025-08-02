const axios = require('axios');

const runCode = async (sourceCode, testCases, languageId) => {
  if (!sourceCode || !Array.isArray(testCases) || !languageId) {
    throw new Error('Missing sourceCode, testCases, or languageId');
  }

  // Ensure safe and valid submissions
  const submissions = testCases.map((tc, idx) => ({
    source_code: sourceCode.trim(),
    language_id: Number(languageId), // ensure it's a number
    stdin: tc.input?.toString() || '',
    expected_output: tc.expectedOutput?.toString() || '',
  }));

  const payload = { submissions };

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false',
      wait: 'true',
    },
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com',
    },
    data: payload,
  };

  // Debug log the outgoing payload
  console.log('🔍 Sending to Judge0:', JSON.stringify(payload, null, 2));

  try {
    const { data } = await axios.request(options);

    const results = data.submissions.map((sub, i) => {
      const passed =
        sub.status?.description === 'Accepted' &&
        sub.stdout?.trim() === testCases[i].expectedOutput?.trim();

      return {
        input: testCases[i].input,
        expectedOutput: testCases[i].expectedOutput,
        actualOutput: sub.stdout || sub.stderr || sub.compile_output || '',
        status: passed ? 'Passed' : 'Failed',
        description: sub.status?.description,
      };
    });

    const overallStatus = results.every(r => r.status === 'Passed') ? 'Passed' : 'Failed';

    return {
      results,
      overallStatus,
      rawOutput: results.map(r => r.actualOutput).join('\n'),
    };
  } catch (error) {
    if (error.response) {
      console.error('❌ Judge0 Error:', error.response.status);
      console.error('📦 Judge0 Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Request Failed:', error.message);
    }
    throw new Error('Code execution failed');
  }
};

module.exports = { runCode };
