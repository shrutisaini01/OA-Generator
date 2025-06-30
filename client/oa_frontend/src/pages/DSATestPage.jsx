import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';

const DSATestPage = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [userCode, setUserCode] = useState('');
  const navigate = useNavigate();

  const question = {
    title: "Two Sum Problem",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

**Example:**
Input: nums = [2,7,11,15], target = 9  
Output: [0,1]`,
    constraints: `- 2 <= nums.length <= 10^4  
- -10^9 <= nums[i] <= 10^9  
- -10^9 <= target <= 10^9`,
    starterCode: `function twoSum(nums, target) {
  // Your code here
}`
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullScreenMode = !!document.fullscreenElement;
      setIsFullscreen(fullScreenMode);
      if (!fullScreenMode) {
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
  }, [violation, navigate]);

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  };

  return (
    <TestLayout>
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

      {!isFullscreen && (
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
    </TestLayout>
  );
};

export default DSATestPage;
