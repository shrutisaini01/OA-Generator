import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeftCircle, CheckSquare, AlertTriangle, XCircle } from 'lucide-react';

const StartTest = () => {
  const [seconds, setSeconds] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showViolationModal, setShowViolationModal] = useState(false);

  const category = searchParams.get("category");
  const displayName = category?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const routeMap = {
    'dsa': '/coding/dsa',
    'development': '/coding/development',
    'machine_learning': '/coding/machine_learning',
    'cs': '/cs', 
    'english': '/english', 
  };
  
  const targetRoute = routeMap[category] || '/';

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener to exit fullscreen (for development)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'q') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fullscreen change handler with a custom modal
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setShowViolationModal(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleStart = () => {
    if (agreed) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen()
          .finally(() => navigate(targetRoute));
      } else {
        navigate(targetRoute);
      }
    }
  };

  const reEnterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    setShowViolationModal(false);
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 text-white font-sans'>
      {/* Home Button */}
      <div className="absolute top-8 right-8">
        <Link to="/">
          <button className="flex items-center space-x-2 px-6 py-2 text-sm font-semibold text-emerald-300 border border-emerald-300 rounded-full hover:bg-emerald-300 hover:text-gray-900 transition-all duration-300 shadow-lg">
            <ChevronLeftCircle size={18} />
            <span>Go Back</span>
          </button>
        </Link>
      </div>

      {/* Main Content Card */}
      <div className='bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-8 w-full max-w-2xl space-y-8 transition-all duration-300'>
        <div className="text-center">
          <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'>
            Test Instructions
          </h1>
          <p className='text-md text-gray-400 mt-2'>Please read carefully before you begin.</p>
        </div>

        {/* User and Test Details */}
        <div className='border-l-4 border-emerald-500 rounded-r-lg p-4 bg-gray-700 shadow-inner'>
          <div className="grid grid-cols-2 gap-y-2 text-sm font-medium">
            <p className="text-gray-400">Name:</p>
            <p className="text-gray-200 font-semibold">{user?.name || 'Loading...'}</p>
            <p className="text-gray-400">Selected Test:</p>
            <p className="text-gray-200 font-semibold">{displayName}</p>
          </div>
        </div>

        {/* Rules List */}
        <div className='p-4 bg-gray-700 rounded-xl shadow-inner'>
          <h2 className="text-lg font-bold mb-3 text-gray-200">Important Rules</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start">
              <span className="mr-2 text-emerald-400"><CheckSquare size={18} /></span>
              Test duration is 90 minutes.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-400"><CheckSquare size={18} /></span>
              Do not copy content or switch tabs. This may lead to disqualification.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-400"><CheckSquare size={18} /></span>
              Fullscreen mode is mandatory throughout the test.
            </li>
          </ul>
        </div>
        
        {/* Countdown & Agreement */}
        <div className="flex flex-col items-center space-y-4">
          <p className='text-gray-400 text-sm'>Test starts in</p>
          <div className='text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 transition-all duration-500'>
            {seconds}s
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="agree" 
              onChange={() => setAgreed(!agreed)} 
              className="form-checkbox text-emerald-500 bg-gray-700 border-gray-600 rounded-md focus:ring-emerald-500"
            />
            <label htmlFor="agree" className="text-sm text-gray-400">
              I agree to the privacy policy and test rules.
            </label>
          </div>
        </div>
        
        {/* Start Button */}
        <button
          className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white font-bold py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={seconds > 0 || !agreed}
          onClick={handleStart}
        >
          Start Test
        </button>
      </div>

      {/* Fullscreen Violation Modal */}
      {showViolationModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform scale-100 transition-transform duration-300 border border-red-500">
            <div className="flex justify-end -mt-4 -mr-4">
              <button onClick={() => setShowViolationModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>
            <div className="mb-4">
              <AlertTriangle size={48} className="text-red-500 mx-auto" />
            </div>
            <p className="mb-6 font-bold text-xl text-red-500">
              Warning: Fullscreen Exited!
            </p>
            <p className="text-sm text-gray-400 mb-6">
              You must remain in fullscreen mode throughout the test to avoid being disqualified. Please re-enter fullscreen to continue.
            </p>
            <button
              className="bg-red-600 text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg"
              onClick={reEnterFullScreen}
            >
              Re-enter Full Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartTest;
