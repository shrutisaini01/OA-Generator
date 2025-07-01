import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';

const CodingCS = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [userCode, setUserCode] = useState('');
  const [step, setStep] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [optionSelected, setOptionSelected] = useState('');
  const [testEnded,setTestEnded]= useState(false);
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

  const csQuestions =[
    {
      title: 'How does a stack work?',
      options: ['FIFO', 'LIFO'],
      correctAnswer: 'LIFO',
    },
    {
      title: 'Full form of CPU?',
      options: ['Central Processing Unit', 'Central Progress Unit','Central Parsing Unit'],
      correctAnswer: 'Central Processing Unit',
    },
  ];

  const handleNext = () => {
    if (currentIndex < csQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setOptionSelected('');
    } else {
      setTestEnded(true);
      alert("Test completed!");
      navigate("/"); // Or show score or results
    }
  };

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  };

  const currentQuestion = csQuestions[currentIndex];

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
                navigate("/");
              }
            }
          };
          document.addEventListener('fullscreenchange', handleFullScreenChange);
          return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
        }, [violation, navigate, testEnded]);
      
        return (
          <>
      {step === 1 ? (
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
          <button
            onClick={() => setStep(2)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow"
          >
            Next
          </button>
        </>
      ) : (
        <>
          <h1 className="mb-4 font-bold text-lg text-blue-600">CS FUNDAMENTALS</h1>
          <p className="mb-4">{currentQuestion.title}</p>
          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="block">
                <input
                  type="radio"
                  name="cs-question"
                  value={option}
                  checked={optionSelected === option}
                  onChange={(e) => setOptionSelected(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
          <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleNext}
        disabled={!optionSelected}
      >
        {currentIndex === csQuestions.length - 1 ? 'Finish' : 'Next'}
      </button>
        </>
      )}

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
      </>
      );
      }}
    </TestLayout>
  );
};

export default CodingCS;
