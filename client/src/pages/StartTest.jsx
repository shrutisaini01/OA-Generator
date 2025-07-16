import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const StartTest = () => {
  const [seconds, setSeconds] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");

  const routeMap = {
    'coding': '/coding',
    'coding-cs': '/coding-cs',
    'cs': '/cs',
    'english': '/english',
    'dsa': '/coding/dsa',
    'development': '/coding/development',
    'machine_learning': '/coding/machine_learning',
  };
  

  const targetRoute = routeMap[category] || '/';

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        alert('You exited fullscreen mode! This may disqualify your attempt!');
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

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50'>
      <div className="absolute top-4 right-6 space-x-4">
        <Link to="/">
          <button className="px-4 py-2 text-sm font-medium text-[#347433] border border-[#347433] rounded hover:bg-[#347433] hover:text-white transition">Home</button>
        </Link>
      </div>
      <div className='bg-white rounded-[20px] border-2 border-black shadow-md p-6 w-full max-w-xl space-y-4'>
        <h1 className='text-2xl font-bold'>Test Instructions</h1>
        <div className='border rounded-[20px] p-4 bg-white'>
          <p><strong>Name:</strong> Shruti Saini</p>
          <p><strong>Institution:</strong> Graphic Era Hill University</p>
          <p><strong>Selected Test:</strong> {category?.toUpperCase()}</p>
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li>Test duration: 90 minutes</li>
          <li>Do not copy or switch tabs</li>
          <li>Full screen mode is mandatory</li>
        </ul>
        <p className='text-black'>Test starts in {seconds}s</p>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="agree" onChange={() => setAgreed(!agreed)} />
          <label htmlFor="agree" className="text-sm">I agree to the privacy policy.</label>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={seconds > 0 || !agreed}
          onClick={handleStart}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default StartTest;
