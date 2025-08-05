import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';
import LanguageSelector from '../components/LanguageSelector';
import { runCode } from '../api/codeRunner';


const MLTestPage = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [status, setStatus] = useState('');
  const [languageId, setLanguageId] = useState(71); // Default: Python
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/questions')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) {
          setUserCode(data[0].starterCode || '');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch questions!', err);
        setError('Failed to load questions. Please refresh the page.');
      });
  }, []);

  const question = questions[index];

  const handleRunCode = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!question.testCases || question.testCases.length === 0) {
        setError('No test cases available for this question.');
        return;
      }

      const result = await runCode(userCode, question.testCases, languageId);
      
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

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  };

  const themeClasses = theme === 'dark'
    ? 'bg-gray-900 text-white shadow-lg'
    : 'bg-white text-gray-900 shadow-md';

  const cardClasses = theme === 'dark'
    ? 'bg-gray-800 border border-gray-700 text-white'
    : 'bg-gray-100 border border-gray-300';

  return (
    <TestLayout>
      {({ testEnded }) => {
        useEffect(() => {
          const handleFullScreenChange = () => {
            const fullScreenMode = !!document.fullscreenElement;
            setIsFullscreen(fullScreenMode);
            if (!fullScreenMode && !testEnded) {
              const newCount = violation + 1;
              setViolations(newCount);
              alert(`You exited fullscreen! Violation count: ${newCount}/3`);
              if (newCount >= 3) {
                alert('Violations exceeded! Your test is disqualified!');
                navigate('/coding');
              }
            }
          };
          document.addEventListener('fullscreenchange', handleFullScreenChange);
          return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
        }, [violation, navigate, testEnded]);

        if (!question) return <p className="p-4">Loading question...</p>;

        return (
          <div className={`min-h-screen px-4 py-6 ${themeClasses}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{question.title}</h2>
              <button
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
              </button>
            </div>

            <pre className="whitespace-pre-wrap mb-4 text-sm font-mono leading-snug opacity-90">
              {question.description}
            </pre>

            {question.constraints && (
              <div className={`${cardClasses} p-3 rounded mb-4`}>
                <p className="font-semibold mb-1">Constraints:</p>
                <pre className="text-xs font-mono">{question.constraints}</pre>
              </div>
            )}

            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Language:</label>
              <LanguageSelector onSelect={setLanguageId} />
            </div>

            <label className="block font-semibold mb-2">Your Code:</label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder={question.starterCode}
              className="w-full h-64 px-4 py-2 border-2 border-gray-500 rounded-lg font-mono text-sm bg-black text-green-300"
            />

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className={`px-4 py-2 rounded shadow text-white ${
                  isLoading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isLoading ? 'Running...' : 'Run Code'}
              </button>

              {index < questions.length - 1 ? (
                <button
                  onClick={() => {
                    setIndex((prev) => prev + 1);
                    setUserCode(questions[index + 1].starterCode || '');
                    setTestResults([]);
                    setStatus('');
                    setOutput('');
                    setError('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={() => {
                    alert('Test Submitted!');
                    navigate('/thankyou');
                  }}
                  className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800"
                >
                  Submit Test
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
                <p className="font-semibold">Error: {error}</p>
              </div>
            )}

            {status && (
              <div className={`${cardClasses} mt-4 p-3 rounded`}>
                <p className="font-semibold">
                  Overall Status: <span>{status}</span>
                </p>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold">Test Case Results:</h3>
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded shadow border text-sm font-mono ${
                      result.status === 'Passed'
                        ? 'bg-green-100 border-green-400'
                        : 'bg-red-100 border-red-400'
                    }`}
                  >
                    <p><strong>Input:</strong> {result.input}</p>
                    <p><strong>Expected:</strong> {result.expectedOutput}</p>
                    <p><strong>Output:</strong> {result.actualOutput}</p>
                    <p className="font-semibold">
                      Status: <span className={result.status === 'Passed' ? 'text-green-700' : 'text-red-700'}>{result.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {output && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Raw Output:</h3>
                <pre className="bg-black text-green-400 p-4 rounded shadow text-sm whitespace-pre-wrap overflow-x-auto">
                  {output}
                </pre>
              </div>
            )}

            {!isFullscreen && !testEnded && (
              <div className="absolute inset-0 bg-black bg-opacity-60 text-white flex flex-col items-center justify-center z-50">
                <p className="font-semibold text-lg mb-4">You exited fullscreen</p>
                <p className="mb-6">Please re-enter fullscreen to resume your test</p>
                <button
                  className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                  onClick={requestFullScreen}
                >
                  Re-enter full screen
                </button>
              </div>
            )}
          </div>
        );
      }}
    </TestLayout>
  );
};

export default MLTestPage;