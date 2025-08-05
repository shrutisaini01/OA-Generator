const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const judgeRoutes = require('./routes/judge');
const chatRoutes = require('./routes/chat');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// ✅ API Routes
app.use('/api', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/judge', judgeRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Judge0 API integration ready`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
