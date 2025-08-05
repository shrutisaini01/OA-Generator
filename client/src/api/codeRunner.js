// codeRunner.js - Client-side API wrapper
import axios from 'axios';

const API_BASE_URL = 'https://oa-generator.onrender.com/api';

export const runCode = async (sourceCode, testCases, languageId) => {
  if (!sourceCode || !Array.isArray(testCases) || !testCases.length || !languageId) {
    throw new Error('Missing or invalid input: sourceCode, testCases, or languageId');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/judge/run`, {
      sourceCode,
      testCases,
      languageId,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Code execution error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Code execution failed');
  }
};

export const getLanguages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/judge/languages`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch languages:', error.response?.data || error.message);
    throw new Error('Failed to fetch supported languages');
  }
};

