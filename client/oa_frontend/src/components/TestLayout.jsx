import { useNavigate, Link } from "react-router-dom";
import { useState,useEffect } from "react";

const TestLayout = ({children}) => {
    const navigate=useNavigate();
    const [timer,setTimer]=useState(90*60);

    useEffect(() => {
        const timeLeft=setInterval(() => {
            setTimer((prev) => prev>0?prev-1:0);
        },1000);
        return () => clearInterval(timeLeft);
    },[]);

    const timeFormat = (seconds) => {
        const h=String(Math.floor(seconds/3600)).padStart(2,'0');
        const m=String(Math.floor((seconds%3600)/60)).padStart(2,'0');
        const s=String(Math.floor(seconds%60)).padStart(2,'0');
        return `${h}:${m}:${s}`;
    };

    const handleEndTest = () => {
        if(confirm('Are you sure you want to end the test?')){
            alert('Test ended');
            navigate('/coding');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-800 shadow px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <img src="/thor.jpg" alt="User Profile" className="w-8 h-8 rounded-full"/>
                    <span className="font-semibold text-white">User</span>
                </div>
                <div className="text-lg font-bold text-white">{timeFormat(timer)}</div>
                <button onClick={handleEndTest} className="bg-red-500 text-white px-4 py-2 rounded-[8px] hover:bg-red-600">End Test</button>
            </nav>
            <div className="bg-white px-6 py-2 shadow flex gap-2 border-b text-sm text-gray-600">
                <span>1 ➝ 2 ➝ 3</span>
                <span className="ml-auto">Question 1 of 3</span>
            </div>
            <main className="p-6">{children}</main>
        </div>
    );
};

export default TestLayout;