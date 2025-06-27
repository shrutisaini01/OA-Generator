import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const StartTest = () => {
    const [seconds,setSeconds]=useState(60);
    const [agreed,setAgreed]=useState(false);
    const navigate=useNavigate();

    useEffect(()=>{
        const time=setInterval(()=>{
            setSeconds(prev => ((prev>0)?prev-1:0));
        },1000);
        return () => clearInterval(timer);
    },[]);

    const handleStart = () => {
        if(agreed) navigate("/coding/starttest");
    };

    const user = {
        name: "Shruti Saini",
        institution: "Graphic Era Hill University"
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50'>
            <div className='bg-white rounded-[20px] border-2 border-black shadow-md p-6 w-full max-w-xl space-y-4'>
                <h1 className='text-2xl font-bold'>Test Instructions</h1>
                <div className='border rounded-[20px] p-4 bg-white'>
                    <p><strong>Name: </strong>{user.name}</p>
                    <p><strong>Instituion: </strong>{user.institution}</p>
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

                <button className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={seconds > 0 || !agreed} onClick={handleStart}>
                Start Test
                </button>
            </div>

        </div>
    );

};

export default StartTest;