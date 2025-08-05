const express = require('express');
const router = express.Router();
require('dotenv').config();

// Initialize Groq client
let groq;
try {
  const { Groq } = require('groq-sdk');
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
} catch (error) {
  console.error('Groq SDK not installed. Please install it with: npm install groq-sdk');
}

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!groq) {
      return res.status(500).json({ 
        error: 'Groq AI is not configured. Please check your API key and installation.' 
      });
    }

    // Build conversation context
    const conversationHistory = history.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Add system message for context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant for an Online Assessment (OA) Generator platform. 
      You can help users with:
      - Coding questions and explanations
      - Data Structures and Algorithms concepts
      - Programming language syntax and best practices
      - Debugging help
      - General software development questions
      - Assessment preparation tips
      
      Be concise, helpful, and provide practical examples when relevant. 
      If you're asked about code, provide clear explanations and suggest improvements when possible.`
    };

    const messages = [systemMessage, ...conversationHistory, { role: 'user', content: message }];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-8b-8192", // Using Llama 3.1 8B model for fast responses
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ response });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your Groq API key.' });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    res.status(500).json({ 
      error: 'An error occurred while processing your request. Please try again.' 
    });
  }
});

module.exports = router; 