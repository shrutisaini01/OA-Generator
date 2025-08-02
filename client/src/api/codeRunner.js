import axios from 'axios';

export const runCode = async (sourceCode, testCases, languageId) => {
  try {
    if (!sourceCode || !testCases || !languageId) {
      throw new Error('Missing input for code execution');
    }

    const payload = {
      sourceCode: sourceCode.trim(),
      testCases,
      languageId: Number(languageId),
    };

    console.log('🚀 Submitting to backend:', payload);

    const response = await axios.post('http://localhost:5000/api/run', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Received from backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error running code:', error.response?.data || error.message);
    throw error;
  }
};
