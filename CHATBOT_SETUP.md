# Chatbot Setup Guide

## Overview
This guide will help you set up the AI chatbot feature for your OA Generator platform. The chatbot is powered by Groq AI and provides assistance with coding questions, explanations, and assessment preparation.

## Features
- 🤖 AI-powered chatbot using Groq AI
- 🌙 Dark/Light theme support
- ✨ Smooth animations with Framer Motion
- 💬 Real-time conversation with context
- 📱 Responsive design
- 🎯 Specialized for coding and assessment help

## Prerequisites
1. Node.js and npm installed
2. Groq AI API key (get it from [Groq Console](https://console.groq.com/))

## Setup Instructions

### 1. Install Dependencies

#### Server Dependencies
```bash
cd server
npm install groq-sdk
```

#### Client Dependencies
The required dependencies are already included:
- `framer-motion` - for animations
- `lucide-react` - for icons

### 2. Environment Configuration

#### Server (.env file)
Add your Groq API key to the server's `.env` file:

```env
# Existing variables...
GROQ_API_KEY=your_groq_api_key_here
```

#### Get Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

### 3. Start the Application

#### Start Server
```bash
cd server
npm run dev
```

#### Start Client
```bash
cd client
npm run dev
```

### 4. Usage

1. Navigate to the home page (`/`)
2. Look for the chat icon in the bottom-right corner
3. Click the icon to open the chatbot
4. Start chatting with the AI assistant!

## Features

### Chatbot Capabilities
- **Coding Help**: Get assistance with programming questions
- **DSA Concepts**: Learn about Data Structures and Algorithms
- **Debugging**: Get help with code debugging
- **Best Practices**: Learn programming best practices
- **Assessment Prep**: Get tips for online assessments

### UI Features
- **Theme Toggle**: Switch between dark and light themes
- **Smooth Animations**: Beautiful transitions and micro-interactions
- **Responsive Design**: Works on all screen sizes
- **Real-time Typing**: See when the AI is thinking
- **Message History**: Maintains conversation context

### Technical Features
- **Context Awareness**: Remembers previous messages
- **Error Handling**: Graceful error handling for API failures
- **Rate Limiting**: Handles API rate limits
- **Loading States**: Visual feedback during API calls

## API Endpoints

### POST /api/chat
Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "Your message here",
  "history": [
    {
      "type": "user",
      "content": "Previous user message"
    },
    {
      "type": "bot", 
      "content": "Previous bot response"
    }
  ]
}
```

**Response:**
```json
{
  "response": "AI assistant response"
}
```

## Customization

### Changing the AI Model
In `server/routes/chat.js`, you can change the model:

```javascript
const completion = await groq.chat.completions.create({
  messages: messages,
  model: "llama3-8b-8192", // Change this to other models
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 1,
  stream: false,
});
```

Available models:
- `llama3-8b-8192` - Fast, good for general use
- `llama3-70b-8192` - More capable, slower
- `mixtral-8x7b-32768` - Good balance
- `gemma2-9b-it` - Google's model

### Customizing the System Prompt
Modify the system message in `server/routes/chat.js`:

```javascript
const systemMessage = {
  role: 'system',
  content: `Your custom system prompt here...`
};
```

### Styling Customization
The chatbot uses Tailwind CSS classes. You can customize the appearance by modifying the classes in `client/src/components/Chatbot.jsx`.

## Troubleshooting

### Common Issues

1. **"Groq AI is not configured"**
   - Check if `GROQ_API_KEY` is set in your `.env` file
   - Ensure the server is running

2. **"Invalid API key"**
   - Verify your Groq API key is correct
   - Check if you have sufficient credits in your Groq account

3. **"Rate limit exceeded"**
   - Wait a moment and try again
   - Consider upgrading your Groq plan

4. **Chatbot not appearing**
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Verify the component is imported correctly

### Debug Mode
Enable debug logging by adding to your server's `.env`:

```env
DEBUG=true
```

## Security Considerations

1. **API Key Security**: Never commit your API key to version control
2. **Rate Limiting**: Implement rate limiting on your server
3. **Input Validation**: The chatbot validates input on both client and server
4. **Error Handling**: Sensitive information is not exposed in error messages

## Performance Optimization

1. **Message History**: Only sends last 10 messages for context
2. **Token Limits**: Configurable max tokens to control response length
3. **Caching**: Consider implementing response caching for common questions
4. **Streaming**: Can be enabled for real-time responses

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Check the server logs for API errors
4. Verify your Groq API key and account status

## License

This chatbot integration is part of the OA Generator project and follows the same license terms. 