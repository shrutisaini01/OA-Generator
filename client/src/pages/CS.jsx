import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestLayout from '../components/TestLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight } from 'lucide-react';

const CS = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [optionSelected, setOptionSelected] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testEnded, setTestEnded] = useState(false);
  const navigate = useNavigate();

  const csQuestions = [
    {
      title: 'How does a stack work?',
      options: ['FIFO', 'LIFO'],
      correctAnswer: 'LIFO',
    },
    {
      title: 'Full form of CPU?',
      options: ['Central Processing Unit', 'Central Progress Unit', 'Central Parsing Unit'],
      correctAnswer: 'Central Processing Unit',
    },
  ];

  const currentQuestion = csQuestions[currentIndex];
  const isCorrect = optionSelected === currentQuestion.correctAnswer;

  const handleNext = () => {
    if (!showResult) {
      setShowResult(true);
      return;
    }

    if (currentIndex < csQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setOptionSelected('');
      setShowResult(false);
    } else {
      setTestEnded(true);
      alert('Test completed!');
      navigate('/');
    }
  };

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
  };

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
          navigate('/');
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, [violation, testEnded, navigate]);

  return (
    <TestLayout>
      <div className="relative p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg mx-auto my-12">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">CS FUNDAMENTALS</h1>
          <p className="mb-6 text-xl font-medium text-gray-800 dark:text-gray-200">{currentQuestion.title}</p>

          <div className="space-y-4 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isAnswer = option === currentQuestion.correctAnswer;
              const isSelected = option === optionSelected;
              const isWrong = showResult && isSelected && !isAnswer;
              const isRight = showResult && isAnswer;

              return (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                    isSelected ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : 'border-transparent bg-white dark:bg-gray-700'
                  } ${
                    isRight ? 'border-green-500 bg-green-100 dark:bg-green-900' : ''
                  } ${
                    isWrong ? 'border-red-500 bg-red-100 dark:bg-red-900' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={isSelected}
                    onChange={() => setOptionSelected(option)}
                    className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-500"
                    disabled={showResult}
                  />
                  <span className="ml-4 text-lg font-medium text-gray-800 dark:text-gray-200">{option}</span>

                  <div className="ml-auto">
                    {showResult && isRight && <Check className="text-green-600 dark:text-green-400 w-5 h-5" />}
                    {showResult && isWrong && <X className="text-red-600 dark:text-red-400 w-5 h-5" />}
                  </div>
                </label>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!optionSelected && !showResult}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {showResult ? (
              isCorrect ? (
                <>
                  <Check className="mr-2" /> Correct! Continue
                </>
              ) : (
                <>
                  <X className="mr-2" /> Incorrect. Next
                </>
              )
            ) : (
              <>
                {currentIndex === csQuestions.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="ml-2" />
              </>
            )}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-8 bg-gray-900 rounded-xl shadow-2xl text-center max-w-sm text-white"
            >
              <p className="font-bold text-2xl mb-4 text-red-400">Fullscreen Exited</p>
              <p className="mb-6 text-lg text-gray-300">
                Please re-enter fullscreen to continue your test.
              </p>
              <button
                onClick={requestFullScreen}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Re-enter Fullscreen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TestLayout>
  );
};

export default CS;
