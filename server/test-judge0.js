const axios = require('axios');
require('dotenv').config();

// Test Judge0 API connection
async function testJudge0API() {
  console.log('🧪 Testing Judge0 API connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`RAPID_API_KEY: ${process.env.RAPID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`JUDGE0_API_HOST: ${process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com'}`);
  console.log('');
  
  if (!process.env.RAPID_API_KEY) {
    console.error('❌ RAPID_API_KEY is not set in your .env file');
    console.log('Please add your RapidAPI key to the .env file:');
    console.log('RAPID_API_KEY=your_rapidapi_key_here');
    return;
  }
  
  try {
    // Test 1: Simple Python submission
    console.log('🔍 Test 1: Simple Python submission');
    const pythonCode = 'print("Hello, World!")';
    
    const submitResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
      source_code: pythonCode,
      language_id: 71, // Python
      stdin: '',
      expected_output: 'Hello, World!'
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
    
    console.log('✅ Submission successful');
    console.log(`Token: ${submitResponse.data.token}`);
    
    // Test 2: Poll for result
    console.log('\n🔍 Test 2: Polling for result');
    const token = submitResponse.data.token;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Polling attempt ${attempts}/${maxAttempts}...`);
      
      const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com',
        },
        timeout: 5000,
      });
      
      const submission = resultResponse.data;
      console.log(`Status: ${submission.status?.description || 'Unknown'} (ID: ${submission.status?.id})`);
      
      if (submission.status && submission.status.id > 2) {
        console.log('✅ Result received');
        console.log(`Output: "${submission.stdout}"`);
        console.log(`Error: "${submission.stderr}"`);
        console.log(`Compile Output: "${submission.compile_output}"`);
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Judge0 API test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Judge0 API test failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('\n💡 This looks like an API key issue. Please check:');
        console.error('1. Your RapidAPI key is correct');
        console.error('2. You have an active subscription to Judge0 API');
        console.error('3. The key is properly set in your .env file');
      } else if (error.response.status === 429) {
        console.error('\n💡 Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.response.status === 400) {
        console.error('\n💡 Bad request. This might be a request format issue.');
      }
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Network error. Please check your internet connection.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('\n💡 Request timeout. The API might be slow or overloaded.');
    }
  }
}

// Run the test
testJudge0API(); 