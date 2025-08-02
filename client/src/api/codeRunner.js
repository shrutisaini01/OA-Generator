import axios from 'axios';

export const runCode = async (sourceCode, testCases, languageId) => {
  try {
    const response = await axios.post('http://localhost:5000/api/run', {
      sourceCode,
      testCases,
      languageId,
    });

    return response.data;
  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};
