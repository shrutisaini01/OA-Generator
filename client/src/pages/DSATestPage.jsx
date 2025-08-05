import { useState, useEffect, useRef } from 'react';
import { LogOut, XCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism-coy.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import TestLayout from '../components/TestLayout';
import LanguageSelector from '../components/LanguageSelector';
import { runCode } from '../api/codeRunner';

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
);

// Map language IDs to Prism.js language names
const languageMap = {
  50: 'c',
  54: 'cpp',
  62: 'java',
  63: 'javascript',
  71: 'python',
};

const LanguageSelectorComponent = ({ onSelect, selectedLanguage }) => {
  const languages = [
    { id: 71, name: "Python" },
    { id: 62, name: "Java" },
    { id: 50, name: "C" },
    { id: 54, name: "C++" }, // Corrected syntax here
    { id: 63, name: "JavaScript" },
  ];

  return (
    <div className="inline-block relative">
      <select
        onChange={(e) => onSelect(parseInt(e.target.value, 10))}
        value={selectedLanguage}
        className="block appearance-none w-full bg-gray-200 border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-200"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronRight size={16} className="transform rotate-90" />
      </div>
    </div>
  );
};


// The main DSA test page component with enhanced UI
const DSATestPage = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [status, setStatus] = useState('');
  const [languageId, setLanguageId] = useState(71);
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const codeEditorRef = useRef(null);
  
  // Timer state and logic
  const [timer, setTimer] = useState(90 * 60);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  // Effect to load questions on component mount
  useEffect(() => {
    setIsLoadingQuestions(true);
    fetch('http://localhost:5000/api/questions')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) {
          setUserCode(data[0].starterCode || '');
        }
        setIsLoadingQuestions(false);
      })
      .catch((err) => {
        console.error('Failed to fetch questions!', err);
        setError('Failed to load questions. Please refresh the page.');
        setIsLoadingQuestions(false);
      });
      
    // Request fullscreen on initial load
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  }, []);

  // Fullscreen change handler with custom modal
  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullScreenMode = !!document.fullscreenElement;
      setIsFullscreen(fullScreenMode);
      if (!fullScreenMode && !testEnded) {
        setViolations(prev => prev + 1);
        setShowViolationModal(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, [testEnded]);

  useEffect(() => {
    if (violation >= 3) {
      setShowViolationModal(false);
      console.log("Test disqualified due to too many fullscreen violations.");
      navigate('/disqualified');
      setTestEnded(true);
    }
  }, [violation, navigate]);

  // Timer effect
  useEffect(() => {
    if (testEnded) return;
    const timeLeft = setInterval(() => {
      setTimer((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timeLeft);
  }, [testEnded]);

  const timeFormat = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const question = questions[index];

  const handleRunCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      setTestResults([]);
      setStatus('');
      setOutput('');

      if (!question) {
        setError('No question loaded. Please refresh the page.');
        return;
      }
      if (!question.testCases || question.testCases.length === 0) {
        setError('No test cases available for this question.');
        return;
      }
      if (!userCode.trim()) {
        setError('Please write some code before running.');
        return;
      }

      console.log('🚀 Running code with:', {
        languageId,
        testCasesCount: question.testCases.length,
        codeLength: userCode.length
      });

      const result = await runCode(userCode, question.testCases, languageId);

      setTestResults(result.results || []);
      setStatus(result.overallStatus || 'No Status');
      setOutput(
        result.rawOutput ||
        result.results?.map((r) => r.actualOutput).join('\n') ||
        'No output'
      );
    } catch (err) {
      console.error('Code execution error:', err);
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
      setUserCode(questions[index + 1].starterCode || '');
      setTestResults([]);
      setStatus('');
      setOutput('');
      setError('');
    }
  };

  const handlePreviousQuestion = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setUserCode(questions[index - 1].starterCode || '');
      setTestResults([]);
      setStatus('');
      setOutput('');
      setError('');
    }
  };

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
    setShowViolationModal(false);
  };
  
  const confirmEndTest = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Could not exit fullscreen:", err);
      });
    }
    setTestEnded(true);
    setShowConfirm(false);
    navigate('/thankyou');
  };

  const themeClasses = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClasses = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300';

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">No questions available</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const handleKeyDown = (e) => {
    // Check for auto-closing brackets and parentheses
    const { key, currentTarget } = e;
    const { selectionStart, selectionEnd } = currentTarget;

    // Autocomplete for braces, parentheses, and brackets
    if (key === '{' || key === '(' || key === '[') {
      e.preventDefault();
      const closingBracket = key === '{' ? '}' : key === '(' ? ')' : ']';
      const newValue = userCode.slice(0, selectionStart) + key + closingBracket + userCode.slice(selectionEnd);
      setUserCode(newValue);
      // Move cursor to the middle
      setTimeout(() => {
        currentTarget.selectionStart = currentTarget.selectionEnd = selectionStart + 1;
      }, 0);
    }
    
    // Tab key handling for indentation
    if (key === 'Tab') {
      e.preventDefault();
      const tabString = '    '; // 4 spaces
      const start = currentTarget.selectionStart;
      const end = currentTarget.selectionEnd;
      
      const newCode = userCode.substring(0, start) + tabString + userCode.substring(end);
      setUserCode(newCode);
      
      // Move cursor to the correct position after inserting the tab
      setTimeout(() => {
        currentTarget.selectionStart = currentTarget.selectionEnd = start + tabString.length;
      }, 0);
    }
  };

  const codeEditorTheme = theme === 'dark'
    ? 'bg-gray-700 text-white'
    : 'bg-white text-gray-800';

  const codeEditorClasses = `w-full h-64 font-mono text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 p-4 leading-normal ${codeEditorTheme}`;
  const highlightedCode = highlight(userCode, languages[languageMap[languageId] || 'clike'], languageMap[languageId] || 'clike');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-inter text-gray-800 relative">
      <nav className="bg-white/90 backdrop-blur-md shadow-lg px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg border-2 border-emerald-600">
            U
          </div>
          <span className="font-semibold text-lg text-emerald-900">User</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Time Left:</span>
          <div className="text-xl font-bold bg-emerald-600 text-white rounded-full px-4 py-2 shadow-inner">
            {timeFormat(timer)}
          </div>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <LogOut size={20} /> End Test
        </button>
      </nav>
      
      <main className={`min-h-screen px-4 py-6 ${themeClasses} transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">{question.title}</h2>
            <p className="text-sm opacity-75">Question {index + 1} of {questions.length}</p>
          </div>
          <button
            className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel: Question Description */}
          <div className={`p-6 rounded-xl shadow-lg border ${cardClasses}`}>
            <h3 className="text-xl font-semibold mb-3">Problem Description</h3>
            <pre className="whitespace-pre-wrap text-sm font-mono leading-snug opacity-90 mb-4">
              {question.description}
            </pre>
            {question.constraints && (
              <div className={`p-4 rounded-lg mt-4 border ${cardClasses}`}>
                <h4 className="font-semibold text-lg mb-1">Constraints:</h4>
                <pre className="text-xs font-mono opacity-80">{question.constraints}</pre>
              </div>
            )}
          </div>

          {/* Right Panel: Code Editor and Results */}
          <div>
            <div className={`p-6 rounded-xl shadow-lg border mb-6 ${cardClasses}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Code Editor</h3>
                <LanguageSelectorComponent onSelect={setLanguageId} selectedLanguage={languageId} />
              </div>
              
              {/* The new code editor component */}
              <Editor
                value={userCode}
                onValueChange={setUserCode}
                highlight={code => highlight(code, languages[languageMap[languageId] || 'clike'], languageMap[languageId] || 'clike')}
                onKeyDown={handleKeyDown} // Custom keydown handler for autocompletion
                padding={15}
                style={{
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
                  borderRadius: '0.5rem',
                  minHeight: '256px',
                  lineHeight: '1.5em',
                  overflow: 'auto',
                }}
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                {index > 0 && (
                  <button
                    onClick={handlePreviousQuestion}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleRunCode}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-lg shadow-md text-white font-bold transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      Running...
                    </div>
                  ) : 'Run Code'}
                </button>
              </div>

              {index < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmissionModal(true)}
                  className="px-6 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-colors duration-200 transform hover:scale-105"
                >
                  Submit Test
                </button>
              )}
            </div>

            {/* Results and Output section */}
            {(error || status || testResults.length > 0 || output) && (
              <div className={`p-6 rounded-xl shadow-lg border ${cardClasses} mt-6`}>
                {error && (
                  <div className="p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 font-semibold mb-4">
                    <p>Error: {error}</p>
                  </div>
                )}
                {status && (
                  <p className="font-semibold text-lg mb-4">
                    Overall Status: <span className={status === 'Passed All' ? 'text-green-500' : 'text-red-500'}>{status}</span>
                  </p>
                )}
                {testResults.length > 0 && (
                  <div className="space-y-4 mb-4">
                    <h3 className="text-xl font-semibold">Test Case Results:</h3>
                    {testResults.map((result, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg shadow border text-sm font-mono ${
                          result.status === 'Passed'
                            ? 'bg-green-50 border-green-400 text-green-800'
                            : 'bg-red-50 border-red-400 text-red-800'
                        }`}
                      >
                        <p><strong>Input:</strong> {result.input}</p>
                        <p><strong>Expected:</strong> {result.expectedOutput}</p>
                        <p><strong>Output:</strong> {result.actualOutput}</p>
                        <p className="font-semibold mt-2">
                          Status: <span className={result.status === 'Passed' ? 'text-green-700' : 'text-red-700'}>{result.status}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {output && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Raw Output:</h3>
                    <pre className="bg-black text-green-400 p-4 rounded shadow text-sm whitespace-pre-wrap overflow-x-auto">
                      {output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fullscreen Violation Modal */}
      {showViolationModal && !testEnded && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform scale-100 transition-transform duration-300">
            <div className="flex justify-end -mt-4 -mr-4">
              <button onClick={() => setShowViolationModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>
            <p className="mb-6 font-semibold text-xl text-gray-800">
              You exited fullscreen!
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Violation count: <span className="font-bold text-red-500">{violation}</span> / 3
              <br />
              Please re-enter fullscreen to continue your test.
            </p>
            <button
              className="bg-green-600 text-white font-bold px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg"
              onClick={requestFullScreen}
            >
              Re-enter Full Screen
            </button>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform scale-100 transition-transform duration-300">
            <div className="flex justify-end -mt-4 -mr-4">
              <button onClick={() => setShowSubmissionModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>
            <p className="mb-6 font-semibold text-xl text-gray-800">
              Are you sure you want to submit your test?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Once submitted, you cannot make any more changes.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 text-white font-bold px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg"
                onClick={() => {
                  setShowSubmissionModal(false);
                  setTestEnded(true);
                  console.log("Test submitted.");
                  navigate('/thankyou');
                }}
              >
                Yes, Submit
              </button>
              <button
                className="bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-full hover:bg-gray-300 transition-all duration-300 shadow-md"
                onClick={() => setShowSubmissionModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* End Test and Disqualified Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm End Test</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end the test? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white font-bold px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300"
                onClick={confirmEndTest}
              >
                End Test
              </button>
              <button
                className="bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-full hover:bg-gray-300 transition-all duration-300"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {testEnded && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-[110] p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-lg w-full transform scale-100 transition-transform duration-300">
            {violation >= 3 ? (
              <>
                <h1 className="text-4xl font-bold text-red-500 mb-4">Test Disqualified</h1>
                <p className="text-lg">You have exceeded the maximum number of fullscreen violations. Your test has been automatically submitted.</p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-emerald-500 mb-4">Thank You!</h1>
                <p className="text-lg">Your test has been successfully submitted.</p>
              </>
            )}
            <button onClick={() => window.location.reload()} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSATestPage;
