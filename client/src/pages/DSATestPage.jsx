import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';

const DSATestPage = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [userCode, setUserCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/questions') // Or filter by topic
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setQuestion(data[0]); // For now, just pick the first question
          setUserCode(data[0].starterCode || '');
        }
      })
      .catch(err => {
        console.error("Failed to fetch question:", err);
      });
  }, []);

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
                alert("Violations exceeded! Your test is disqualified!");
                navigate("/coding");
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

            <label className="block font-semibold mb-2 px-4 py-2">Your Code:</label>
            <textarea
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              placeholder={question.starterCode}
              className="w-full h-64 px-4 py-2 border-2 border-gray-300 rounded font-mono text-sm"
            />

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

