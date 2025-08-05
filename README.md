# OA Generator - Online Assessment Platform

A comprehensive online assessment platform with integrated Judge0 API for code execution and testing.

## Features

- **Multi-language Code Execution**: Support for C, C++, Java, JavaScript, and Python
- **Real-time Code Testing**: Integrated Judge0 API for secure code execution
- **Multiple Test Types**: DSA, Development, and Machine Learning assessments
- **Fullscreen Test Mode**: Secure testing environment with violation tracking
- **Dark/Light Theme**: User-friendly interface with theme switching
- **Real-time Results**: Immediate feedback on code execution and test results

## Supported Programming Languages

- **C (GCC 9.2.0)** - Language ID: 50
- **C++ (GCC 9.2.0)** - Language ID: 54
- **Java (OpenJDK 13.0.1)** - Language ID: 62
- **JavaScript (Node.js 12.14.0)** - Language ID: 63
- **Python (3.8.1)** - Language ID: 71

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- RapidAPI account with Judge0 API access

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd OA-Generator
```

### 2. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/oa-generator

# Judge0 API Configuration (RapidAPI)
RAPID_API_KEY=your_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here
```

### 4. Get RapidAPI Key

1. Sign up at [RapidAPI](https://rapidapi.com)
2. Subscribe to [Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)
3. Copy your API key and add it to the `.env` file

### 5. Start the Application

**Development Mode:**

**Server:**
```bash
cd server
npm run dev
```

**Client:**
```bash
cd client
npm run dev
```

**Production Mode:**

**Build Client:**
```bash
cd client
npm run build
```

**Start Server:**
```bash
cd server
npm start
```

## API Endpoints

### Judge0 Integration
- `GET /api/judge/languages` - Get supported programming languages
- `POST /api/judge/run` - Execute code with test cases
- `GET /api/judge/health` - Health check for Judge0 service

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `GET /api/questions/:id` - Get specific question

### Authentication
- `POST /api/signup` - User registration
- `POST /api/signin` - User login

## Code Execution Flow

1. **Client submits code** with test cases and language selection
2. **Server validates** input and language support
3. **Judge0 API** executes code in secure environment
4. **Results are compared** against expected outputs
5. **Detailed feedback** is returned to client

## Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes user inputs
- **Secure Execution**: Code runs in isolated environment
- **Fullscreen Enforcement**: Prevents cheating during tests
- **Violation Tracking**: Monitors test integrity

## Error Handling

The application includes comprehensive error handling for:

- **API Rate Limits**: Automatic retry with user feedback
- **Invalid Code**: Syntax and runtime error detection
- **Network Issues**: Connection timeout handling
- **Authentication**: Secure token validation

## Development

### Project Structure
```
OA-Generator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # Reusable components
│   │   └── pages/         # Application pages
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── models/           # Database models
│   └── package.json
└── README.md
```

### Adding New Languages

To add support for additional programming languages:

1. Update `SUPPORTED_LANGUAGES` in `server/utils/runCode.js`
2. Add language ID to Judge0 API configuration
3. Update frontend language selector

## Troubleshooting

### Common Issues

1. **Judge0 API Errors**
   - Check RapidAPI subscription status
   - Verify API key in environment variables
   - Ensure proper request format

2. **MongoDB Connection**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure database exists

3. **Code Execution Timeouts**
   - Check network connectivity
   - Verify Judge0 API status
   - Review code complexity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
