import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCw, Lightbulb, Moon, Check, X, ChevronsRight, Send, AlertTriangle } from 'lucide-react';
import TestLayout from '../components/TestLayout';
import { saveAssessmentAttempt } from "../utils/progress";

// New mock data and API functions for a self-contained, runnable example.
// The questions are now focused on development tasks rather than DSA.
const mockQuestions = [
  {
    id: 1,
    title: "Basic Sentiment Predictor",
    description: "Write a Python function `predict(text)` that returns `'positive'` if the text contains the word `'good'`, otherwise `'negative'`.",
    starterCode: "def predict(text):\n    # Your code here\n    pass",
    testCases: [
      { input: "I feel good", expectedOutput: "positive" },
      { input: "This is bad", expectedOutput: "negative" },
    ],
    constraints: "Use basic Python string operations. No libraries.",
  }
];

const mockRunCode = async (code, testCases, languageId) => {
  // Simulate a 1-second delay for "running" the code
  await new Promise(resolve => setTimeout(resolve, 1000));

  const results = testCases.map((testCase) => {
    let actualOutput = "Simulated execution failed.";
    let status = "Failed";

    // Basic simulation: Look for keywords in code and match to expected
    // This is NOT real execution, just matching based on string logic
    const lowerCode = code.toLowerCase();

    if (languageId === 70) { // Python only
      // Example: Predict function returns "positive" for input "happy"
      if (
        lowerCode.includes("def predict") &&
        lowerCode.includes("return") &&
        lowerCode.includes(testCase.expectedOutput.toLowerCase())
      ) {
        actualOutput = testCase.expectedOutput;
        status = "Passed";
      }
    }

    return {
      ...testCase,
      actualOutput,
      status,
    };
  });

  const allPassed = results.every((r) => r.status === "Passed");
  return {
    results,
    overallStatus: allPassed
      ? "All Test Cases Passed"
      : "Some Test Cases Failed",
    rawOutput: results.map((r) => r.actualOutput).join("\n"),
  };
};

const LanguageSelector = ({ onSelect }) => {
  return (
    <select
      onChange={(e) => onSelect(parseInt(e.target.value))}
      className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <option value={70}>Python</option>
    </select>
  );
};

// The main MLTestPage component
const MLTestPage = () => {
  const [violation, setViolations] = useState(0);
  const [questions] = useState(mockQuestions);
  const [index, setIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [status, setStatus] = useState('');
  const [languageId, setLanguageId] = useState(63); // Default: JavaScript
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const navigate = useNavigate();

  // Load starter code for the current question
  useEffect(() => {
    if (questions.length > 0) {
      setUserCode(questions[index].starterCode || '');
    }
  }, [questions, index]); // Depend on index to update starter code

  const question = questions[index];

  const handleRunCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!question.testCases || question.testCases.length === 0) {
        setError('No test cases available for this question.');
        setIsLoading(false);
        return;
      }

      const result = await mockRunCode(userCode, question.testCases, languageId);
      
      setTestResults(result.results || []);
      setStatus(result.overallStatus || 'No Status');
      setOutput(
        result.rawOutput ||
        result.results?.map((r) => r.actualOutput).join('\n') ||
        'No output'
      );
    } catch (err) {
      setTestResults([]);
      setStatus('Error running code');
      setOutput('Error occurred while executing code');
      setError(err.message || 'An error occurred while running your code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
      setTestResults([]);
      setStatus('');
      setOutput('');
      setError('');
    }
  };

  const calculateAndSaveProgress = () => {
    // Calculate score based on test results
    let correctAnswers = 0;
    let totalQuestions = questions.length;
    
    // For each question, check if all test cases passed
    questions.forEach((question, questionIndex) => {
      // Get test results for this question (this is a simplified approach)
      const questionResults = testResults.filter((result, index) => {
        return result.status === 'Passed';
      });
      
      // If all test cases for this question passed, count it as correct
      if (questionResults.length > 0) {
        correctAnswers++;
      }
    });
    
    // Save progress
    saveAssessmentAttempt('machine_learning', correctAnswers, totalQuestions);
  };

  const handleSubmitTest = () => {
    calculateAndSaveProgress();
    setTestEnded(true);
    alert('Test Submitted!'); // Can be replaced with a custom modal
    navigate('/thankyou');
  };

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    setShowViolationModal(false);
  };

  // Fullscreen change handler with custom modal
  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullScreenMode = !!document.fullscreenElement;
      if (!fullScreenMode && !testEnded) {
        const newCount = violation + 1;
        setViolations(newCount);
        setShowViolationModal(true);
        if (newCount >= 3) {
          navigate('/coding');
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, [violation, navigate, testEnded]);

  if (!question) return <p className="p-4 bg-gray-900 text-white">Loading question...</p>;

  // Dynamically apply theme classes based on state
  const themeClasses = theme === 'dark'
    ? 'bg-gray-900 text-white'
    : 'bg-white text-gray-900';
  
  const questionCardClasses = theme === 'dark'
    ? 'bg-gray-800 border-gray-700'
    : 'bg-gray-100 border-gray-200';
  
  const editorClasses = theme === 'dark'
    ? 'bg-gray-900 text-green-300 border-gray-700'
    : 'bg-gray-200 text-gray-800 border-gray-300';

  return (
    <TestLayout>
      <div className={`flex min-h-screen font-sans overflow-hidden ${themeClasses}`}>
        {/* Question and Controls Section */}
        <div className="w-1/2 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {question.title}
              </h2>
              <span className="text-sm text-gray-400 mt-1">
                Question {index + 1} of {questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full bg-gray-700 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-emerald-600"
                onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
              >
                {theme === 'dark' ? <Lightbulb size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span className="text-red-500 font-semibold">{violation}</span>
                <span>/ 3 violations</span>
              </div>
            </div>
          </div>

          {/* Question Description */}
          <div className={`${questionCardClasses} p-6 rounded-2xl shadow-xl border mb-6`}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{question.description}</p>
          </div>

          {/* Constraints */}
          {question.constraints && (
            <div className={`${questionCardClasses} p-4 rounded-xl border mb-6`}>
              <h3 className="font-bold text-gray-200 mb-2 flex items-center">
                <AlertTriangle size={16} className="text-yellow-400 mr-2" />
                Constraints
              </h3>
              <pre className="text-xs text-gray-400 font-mono">{question.constraints}</pre>
            </div>
          )}

          {/* Language Selector */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-300">Select Language:</label>
            <LanguageSelector onSelect={setLanguageId} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg font-bold transition-all duration-300 ${
                isLoading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white transform hover:scale-105'
              }`}
            >
              {isLoading ? <RotateCw size={18} className="animate-spin" /> : <Play size={18} />}
              <span>{isLoading ? 'Running...' : 'Run Code'}</span>
            </button>

            {index < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 text-white rounded-full shadow-lg font-bold transition-all duration-300 hover:bg-cyan-700 transform hover:scale-105"
              >
                <span>Next Question</span>
                <ChevronsRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-full shadow-lg font-bold transition-all duration-300 hover:bg-red-700 transform hover:scale-105"
              >
                <span>Submit Test</span>
                <Send size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Code Editor and Output Section */}
        <div className={`w-1/2 p-8 border-l ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} overflow-y-auto flex flex-col`}>
          {/* Code Editor */}
          <div className="flex-1 mb-6 flex flex-col">
            <label className="block font-semibold mb-2 text-gray-300">Your Code:</label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className={`flex-1 w-full px-4 py-2 border-2 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${editorClasses}`}
              placeholder="Write your code here..."
            />
          </div>

          {/* Output and Results */}
          <div className={`p-6 rounded-2xl border shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Output
            </h3>
            {error && (
              <div className="p-4 rounded-lg bg-red-900 border border-red-700 text-red-300 mb-4">
                <p className="font-semibold flex items-center">
                  <X size={16} className="mr-2" /> Error: {error}
                </p>
              </div>
            )}
            {status && (
              <div className={`p-4 rounded-lg border mb-4 ${status.includes('Passed') ? 'bg-green-900 border-green-700 text-green-300' : 'bg-red-900 border-red-700 text-red-300'}`}>
                <p className="font-semibold flex items-center">
                  {status.includes('Passed') ? <Check size={16} className="mr-2" /> : <X size={16} className="mr-2" />}
                  Overall Status: <span>{status}</span>
                </p>
              </div>
            )}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-200">Test Case Results:</h4>
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border text-sm font-mono ${
                      result.status === 'Passed'
                        ? 'bg-green-900 border-green-700 text-green-300'
                        : 'bg-red-900 border-red-700 text-red-300'
                    }`}
                  >
                    <p><strong>Input:</strong> {result.input}</p>
                    <p><strong>Expected:</strong> {result.expectedOutput}</p>
                    <p><strong>Output:</strong> {result.actualOutput}</p>
                    <p className="font-semibold mt-2 flex items-center">
                      Status: {result.status === 'Passed' ? <Check size={16} className="ml-2 text-green-300" /> : <X size={16} className="ml-2 text-red-300" />}
                      <span className="ml-1">{result.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fullscreen Violation Modal */}
        {showViolationModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform scale-100 transition-transform duration-300 border border-red-500">
              <div className="mb-4">
                <AlertTriangle size={48} className="text-red-500 mx-auto" />
              </div>
              <p className="mb-6 font-bold text-xl text-red-500">
                Warning: Fullscreen Exited!
              </p>
              <p className="text-sm text-gray-400 mb-6">
                You have exited fullscreen. After {violation} violations, your test may be disqualified. Please re-enter fullscreen to continue.
              </p>
              <button
                className="bg-red-600 text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg"
                onClick={requestFullScreen}
              >
                Re-enter Full Screen
              </button>
            </div>
          </div>
        )}
      </div>
    </TestLayout>
  );
};

export default MLTestPage;