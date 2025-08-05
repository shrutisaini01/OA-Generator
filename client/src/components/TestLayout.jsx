import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, XCircle } from 'lucide-react';

// The main layout component for the test pages. It now features a more modern,
// dark-themed design with enhanced visual elements and animations.
const TestLayout = ({children}) => {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(90 * 60); // 90 minutes in seconds
    const [showConfirm, setShowConfirm] = useState(false);
    const [testEnded, setTestEnded] = useState(false);

    // useEffect to handle the countdown timer
    useEffect(() => {
        const timeLeft = setInterval(() => {
            setTimer((prev) => prev > 0 ? prev - 1 : 0);
        }, 1000);
        // Clean up the interval on component unmount
        return () => clearInterval(timeLeft);
    }, []);

    // Formats the seconds into a human-readable HH:MM:SS format
    const timeFormat = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(seconds % 60)).padStart(2, '0');
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
        // The main container now uses a subtle dark gradient for a professional look.
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 font-inter text-gray-200 relative">
            
            {/* Test Navbar - A sleek, floating header */}
            <nav className="bg-slate-900/80 backdrop-blur-lg shadow-xl px-8 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-700">
                
                {/* User Info with a vibrant avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-400 shadow-md">
                        U
                    </div>
                    <span className="font-semibold text-lg text-indigo-400">User</span>
                </div>
                
                {/* Timer Display - A prominent, gold-colored element */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-400">Time Left:</span>
                    <div className="text-2xl font-bold bg-amber-400 text-slate-900 rounded-full px-6 py-2 shadow-inner shadow-amber-500/50">
                        {timeFormat(timer)}
                    </div>
                </div>
                
                {/* End Test Button - Styled for urgency and interactivity */}
                <button 
                    onClick={handleEndTest} 
                    className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-700/30"
                >
                    <LogOut size={20} /> End Test
                </button>
            </nav>
            
            {/* Main Content Area */}
            <main className="p-8">
                {children}
            </main>
            
            {/* Confirmation Modal - Now a more impactful and styled UI element */}
            {showConfirm && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-[100] p-4 animate-fade-in">
                    <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full border-2 border-slate-700 transform transition-transform duration-300 scale-100 animate-slide-up">
                        <div className="flex justify-end -mt-6 -mr-6">
                            <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <XCircle size={28} />
                            </button>
                        </div>
                        <p className="mb-6 font-semibold text-2xl text-white">
                            Are you sure you want to end the test?
                        </p>
                        <p className="text-sm text-gray-400 mb-6">
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
                                className="bg-gray-700 text-gray-200 font-bold px-6 py-3 rounded-full hover:bg-gray-600 transition-all duration-300 shadow-md" 
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
        <div className="p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-3xl font-bold mb-4 text-white">Question Title</h2>
            <p className="text-gray-300 text-lg">
                This is a sample question. If you click "End Test", a modal will appear. The `testEnded` prop is: {testEnded.toString()}
            </p>
        </div>
    );
};

export default TestLayout;
