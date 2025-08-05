import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, X, AlertTriangle } from 'lucide-react'; // Using Lucide React for icons
import TestLayout from '../components/TestLayout';

const English = () => {
  const [violation, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [optionSelected, setOptionSelected] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testEnded, setTestEnded] = useState(false);
  const navigate = useNavigate();

  const englishQuestions = [
    {
      title: 'Choose the sentence that is grammatically correct:',
      options: [
        'She don’t like cold coffee.',
        'He go to school every day',
        'They has finished their homework',
        'She doesn’t like cold coffee.',
      ],
      correctAnswer: 'She doesn’t like cold coffee.',
    },
    {
      title: 'What comes next in the sequence? 2, 4, 8, 16, ?',
      options: ['18', '24', '32', '30'],
      correctAnswer: '32',
    },
    // Add more questions here
  ];

  const currentQuestion = englishQuestions[currentIndex];

  const requestFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  };

  const handleNext = () => {
    // This is where you would typically check the answer and update a score.
    // For this example, we'll just move to the next question.
    if (currentIndex < englishQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setOptionSelected('');
    } else {
      setTestEnded(true);
      alert("Test completed!");
      navigate("/"); // Or show score or results
    }
  };

  return (
    <TestLayout>
      {() => {
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

        // The UI part of your component
        return (
          <div className="relative p-6 md:p-8 bg-white rounded-2xl shadow-xl max-w-xl mx-auto my-10 dark:bg-gray-900 transition-colors duration-300">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                English Questions
              </h1>
              <p className="mb-6 text-xl font-medium text-gray-800 dark:text-gray-200">
                {currentQuestion.title}
              </p>
              <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200
                      ${optionSelected === option
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      relative `}
                  >
                    <input
                      type="radio"
                      name={`english-question-${currentIndex}`}
                      value={option}
                      checked={optionSelected === option}
                      onChange={(e) => setOptionSelected(e.target.value)}
                      className="mr-3 h-5 w-5 appearance-none rounded-full border border-gray-400 checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    />
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {option}
                    </span>
                    {optionSelected === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-blue-600 dark:text-blue-400"
                      >
                        <Check size={20} />
                      </motion.div>
                    )}
                  </label>
                ))}
              </div>
              <button
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleNext}
                disabled={!optionSelected}
              >
                {currentIndex === englishQuestions.length - 1 ? (
                  <span className="flex items-center">
                    Finish <Check className="ml-2 h-5 w-5" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Next <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
            </motion.div>

            <AnimatePresence>
              {!isFullscreen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm text-white flex flex-col items-center justify-center z-50 p-4 transition-all duration-300"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 bg-gray-900 rounded-xl shadow-2xl text-center max-w-sm"
                  >
                    <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
                    <p className="font-bold text-2xl mb-4 text-red-400">
                      Fullscreen Exited
                    </p>
                    <p className="mb-6 text-lg text-gray-300">
                      Please re-enter fullscreen to resume your test without interruption.
                    </p>
                    <button
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                      onClick={requestFullScreen}
                    >
                      Re-enter full screen
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                      Violations: {violation}/3
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }}
    </TestLayout>
  );
};

export default English;