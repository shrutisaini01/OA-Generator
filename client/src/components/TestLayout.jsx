import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useState,useEffect } from "react";
import { LogOut, XCircle } from 'lucide-react';

// This is the main layout component for the test pages. It includes a header with
// a timer and an "End Test" button, and a main content area for test questions.
const TestLayout = ({children}) => {
  const navigate=useNavigate();
  const [timer,setTimer]=useState(90*60); // 90 minutes in seconds
  const [showConfirm,setShowConfirm]=useState(false);
  const [testEnded,setTestEnded]=useState(false);

  // useEffect to handle the countdown timer
  useEffect(() => {
      const timeLeft=setInterval(() => {
          setTimer((prev) => prev > 0 ? prev - 1 : 0);
      },1000);
      // Clean up the interval on component unmount
      return () => clearInterval(timeLeft);
  },[]);

  // Formats the seconds into a human-readable HH:MM:SS format
  const timeFormat = (seconds) => {
      const h = String(Math.floor(seconds/3600)).padStart(2,'0');
      const m = String(Math.floor((seconds%3600)/60)).padStart(2,'0');
      const s = String(Math.floor(seconds%60)).padStart(2,'0');
      return `${h}:${m}:${s}`;
  };

  // Handles showing the confirmation modal before ending the test
  const handleEndTest = () => {
      setShowConfirm(true);
  };

  // Logic to end the test after user confirmation
  const confirmEndTest = () => {
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Could not exit fullscreen:", err);
      });
    }
  
    // Set flag to prevent violation warnings and navigate to the coding page
    setTestEnded(true);
    navigate('/coding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-inter text-gray-800 relative">
      
      {/* Test Navbar - A sleek, floating header */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg border-2 border-emerald-600">
            U
          </div>
          <span className="font-semibold text-lg text-emerald-900">User</span>
        </div>
        
        {/* Timer Display */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Time Left:</span>
          <div className="text-xl font-bold bg-emerald-600 text-white rounded-full px-4 py-2 shadow-inner">
            {timeFormat(timer)}
          </div>
        </div>
        
        {/* End Test Button */}
        <button 
          onClick={handleEndTest} 
          className="flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <LogOut size={20} /> End Test
        </button>
      </nav>
      
      {/* Progress Indicator */}
      <div className="bg-white/90 backdrop-blur-md px-6 py-4 shadow-md flex justify-between items-center text-gray-600 sticky top-[60px] z-40 border-b-2 border-gray-100">
        <span className="font-semibold text-sm">Question 1 of 3</span>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
          <span>1</span>
          <span className="text-emerald-500">➝</span>
          <span>2</span>
          <span className="text-emerald-500">➝</span>
          <span>3</span>
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="p-6">{children}</main>
      
      {/* Confirmation Modal - now a styled UI element */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform scale-100 transition-transform duration-300">
            <div className="flex justify-end -mt-4 -mr-4">
              <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>
            <p className="mb-6 font-semibold text-xl text-gray-800">
              Are you sure you want to end the test?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              You will not be able to resume the test after ending it.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                className="bg-red-600 text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg" 
                onClick={confirmEndTest}
              >
                Yes, End
              </button>
              <button 
                className="bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-full hover:bg-gray-300 transition-all duration-300 shadow-md" 
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {children && typeof children === 'function' ? children({testEnded}) : null}
    </div>
  );
};

// A dummy component to simulate the content of the test.
const TestContent = ({ testEnded }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Question Title</h2>
      <p className="text-gray-700">This is a sample question. If you click "End Test", a modal will appear. The `testEnded` prop is: {testEnded.toString()}</p>
    </div>
  );
};

// This App component is the entry point and wraps the TestLayout component in a Router,
// which is required for useNavigate and Link to function properly.
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <TestLayout>
            <TestContent />
          </TestLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
