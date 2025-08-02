import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';
import LanguageSelector from '../components/LanguageSelector';
import { runCode } from '../api/codeRunner';

const DSATestPage = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [status, setStatus] = useState('');
  const [languageId, setLanguageId] = useState(54); // Default: C++ (change if needed)
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
      .catch((err) => console.error('Failed to fetch questions!', err));
  }, []);

  const question = questions[index];

  const handleRunCode = async () => {
    try {
      const response = await runCode(userCode, question.testCases, languageId);
      setTestResults(response.results || []);
      setStatus(response.overallStatus || 'No Status');
      setOutput(
        response.rawOutput ||
          response.results?.map((r) => r.actualOutput).join('\n') ||
          'No output'
      );
    } catch (err) {
      setTestResults([]);
      setStatus('Error running code');
      setOutput('Error occurred while executing code');
    }
  };

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  };

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
          <>
            <h2 className="text-xl font-semibold text-blue-600 mb-4 px-4 py-2">{question.title}</h2>
            <pre className="whitespace-pre-wrap text-gray-700 mb-4 px-4 py-2">{question.description}</pre>

            {question.constraints && (
              <>
                <p className="text-sm font-semibold px-4 py-2">Constraints:</p>
                <pre className="bg-gray-100 p-3 rounded mb-4 text-sm px-4 py-2">{question.constraints}</pre>
              </>
            )}

            {/* Language Selector */}
            <div className="px-4 py-2 mb-2">
              <label className="block font-semibold mb-1">Select Language:</label>
              <LanguageSelector onSelect={setLanguageId} />
            </div>

            {/* Code Editor */}
            <label className="block font-semibold mb-2 px-4 py-2">Your Code:</label>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder={question.starterCode}
              className="w-full h-64 px-4 py-2 border-2 border-gray-300 rounded font-mono text-sm"
            />

            <div className="flex justify-between items-center mt-4 px-4">
              <button
                onClick={handleRunCode}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Run Code
              </button>

              {index < questions.length - 1 ? (
                <button
                  onClick={() => {
                    setIndex((prev) => prev + 1);
                    setUserCode(questions[index + 1].starterCode || '');
                    setTestResults([]);
                    setStatus('');
                    setOutput('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={() => {
                    alert('Test Submitted!');
                    navigate('/thankyou');
                  }}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                >
                  Submit Test
                </button>
              )}
            </div>

            {status && (
              <div className="mt-4 px-4 py-3 bg-gray-50 border rounded">
                <p className="font-semibold text-blue-700">
                  Overall Status: <span className="text-black">{status}</span>
                </p>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="mt-2 space-y-2 px-4">
                <h3 className="text-lg font-semibold text-gray-700">Test Case Results:</h3>
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={`p-3 border rounded ${
                      result.status === 'Passed'
                        ? 'bg-green-100 border-green-400'
                        : 'bg-red-100 border-red-400'
                    }`}
                  >
                    <p className="text-sm"><strong>Input:</strong> {result.input}</p>
                    <p className="text-sm"><strong>Expected Output:</strong> {result.expectedOutput}</p>
                    <p className="text-sm"><strong>Your Output:</strong> {result.actualOutput}</p>
                    <p className="text-sm font-semibold">
                      Status:{' '}
                      <span className={result.status === 'Passed' ? 'text-green-700' : 'text-red-700'}>
                        {result.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {output && (
              <div className="mt-4 px-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Raw Output:</h3>
                <pre className="bg-black text-green-300 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            )}

            {!isFullscreen && !testEnded && (
              <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col items-center justify-center z-50">
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
          </>
        );
      }}
    </TestLayout>
  );
};

export default DSATestPage;
