import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';

const CS = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [optionSelected, setOptionSelected] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testEnded,setTestEnded] = useState(false);
  const navigate = useNavigate();

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
      </>);
      }}
    </TestLayout>
  );
};

export default CS;
