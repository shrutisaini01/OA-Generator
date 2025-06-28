import {useState,useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';

const DSATestPage = () => {
    const [violation,setViolations]=useState(0);
    const [isFullscreen,setIsFullscreen]=useState(!!document.fullscreenElement); //!! because document.fullscreenelement is an object when fullscreen else its null --> !document.fullscreenelement true when null so to check actual boolen status we use 
    const navigate=useNavigate();
    useEffect(()=>{
        const handleFullScreenChange = () => {
            const fullScreenMode=!!document.fullscreenElement;
            setIsFullscreen(fullScreenMode);
            if(!fullScreenMode){
                console.log("Fullscreen violated");
                const newCount=violation+1;
                setViolations(newCount);
                alert(`You exited fullscreen! Violation count: ${newCount}/3`);
                if(newCount>=3){
                    alert("Violations exceeded! Your test is disqualified!");
                    navigate("/coding");
                }
            }
        };
        document.addEventListener('fullscreenchange',handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    },[violation,navigate]);

    const requestFullScreen = () => {
        const element=document.documentElement;
        if(element.requestFullscreen){
            element.requestFullscreen();
        }else if(element.webkitRequestFullscreen){
            element.webkitRequestFullScreen();
        }else if(element.msRequestFullscreen){
            element.msRequestFullScreen();
        }
    };

    return (
        <div className='relative p-6'>
            <h1 className='text-xl font-bold text-blue-500'>DSA Test Page</h1>
            <textarea className='p-2 mt-4 w-full border-2 border-black'/>
            {!isFullscreen && (
                <div className='absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col items-center justify-center z-50'>
                    <p className='font-semibold text-lg mb-4'>You exited fullscreen</p>
                    <p className='mb-6'>Please re-enter fullscreen to resume your test</p>
                    <button className='px-4 py-2 bg-green-500 rounded hover:bg-green-600' onClick={requestFullScreen}>Re-enter full screen</button>
                </div>
            )}
        </div>
    );
};

export default DSATestPage;