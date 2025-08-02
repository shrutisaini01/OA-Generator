const axios = require('axios');

const runCode = async (sourceCode, testCases, languageId) => {
  if (!sourceCode || !Array.isArray(testCases) || !languageId) {
    throw new Error('Missing sourceCode, testCases, or languageId');
  }

  const submissions = testCases.map(tc => ({
    source_code: sourceCode,
    language_id: languageId,
    stdin: tc.input,
    expected_output: tc.expectedOutput,
  }));

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: { base64_encoded: 'false', wait: 'true' },
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
      'X-RapidAPI-Host': process.env.JUDGE0_API_HOST,
    },
    data: { submissions },
  };

  try {
    const { data } = await axios.request(options);

    const results = data.submissions.map((sub, i) => {
      const passed =
        sub.status.description === 'Accepted' &&
        sub.stdout?.trim() === testCases[i].expectedOutput?.trim();

      return {
        input: testCases[i].input,
        expectedOutput: testCases[i].expectedOutput,
        actualOutput: sub.stdout || sub.stderr || '',
        status: passed ? 'Passed' : 'Failed',
      };
    });

    const overallStatus = results.every(r => r.status === 'Passed') ? 'Passed' : 'Failed';

    return {
      results,
      overallStatus,
      rawOutput: results.map(r => r.actualOutput).join('\n'),
    };
  } catch (error) {
    console.error('Judge0 execution error:', error.message);
    throw new Error('Code execution failed');
  }
};

module.exports = { runCode };
