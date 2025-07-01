import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';

const DevTestPage = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [userCode, setUserCode] = useState('');
  const [testEnded, setTestEnded] = useState(false);
  const navigate = useNavigate();

  const question = {
    title: "Create a Button Click Counter",
    description: `Build a simple webpage feature using JavaScript. 

Your task is to write a function that adds a button to the page. When the button is clicked, it should update a counter on the screen showing how many times it has been clicked.

**Example behavior:**
- When the page loads, it should display a button labeled "Click Me!" and a counter starting at 0.
- When the user clicks the button, the counter should increment and display the new count.`,
    constraints: `- Do not use any external libraries like jQuery.
- Use plain HTML, CSS (optional), and JavaScript only.
- You may assume the HTML file is already linked to your JavaScript.`,
    starterCode: `// You can use this starter structure:
document.addEventListener('DOMContentLoaded', function () {
  // Your code here
});`
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
                alert("Violations exceeded! Your test is disqualified!");
                navigate("/coding");
              }
            }
          };
          document.addEventListener('fullscreenchange', handleFullScreenChange);
          return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
        }, [violation, navigate, testEnded]);

        return (
          <>
      <h2 className="text-xl font-semibold text-blue-600 mb-4">{question.title}</h2>
      <pre className="whitespace-pre-wrap text-gray-700 mb-4">{question.description}</pre>
      <p className="text-sm font-semibold">Constraints:</p>
      <pre className="bg-gray-100 p-3 rounded mb-4 text-sm">{question.constraints}</pre>

      <label className="block font-semibold mb-2">Your Code:</label>
      <textarea
        value={userCode}
        onChange={e => setUserCode(e.target.value)}
        placeholder={question.starterCode}
        className="w-full h-64 p-3 border-2 border-gray-300 rounded font-mono text-sm"
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

export default DevTestPage;
