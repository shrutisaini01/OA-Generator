import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate, Link } from 'react-router-dom';


const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [isHuman,setIsHuman]=useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, college, provider: 'local' }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(`Welcome, ${name}! You're signed up.`);
        navigate('/signin');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };
  

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credential); 
    console.log('Google user info:', decoded);
    setName(decoded.name || '');
    setEmail(decoded.email || '');
    setUsername(decoded.email || '');
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="absolute top-4 right-6 space-x-4">
        <Link to="/">
          <button className="px-4 py-2 text-sm font-medium text-[#347433] border border-[#347433] rounded hover:bg-[#347433] hover:text-white transition">Home</button>
        </Link>
        </div>
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
        <p className="text-sm text-gray-500 mb-4">
          Already have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/signin')}>Log in</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Institution / Organization</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Enter Institution name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="notRobot"
                checked={isHuman}
                onChange={(e) => setIsHuman(e.target.checked)}
                className="w-4 h-4"
                required
            />
            <label htmlFor="notRobot" className="text-sm text-gray-700">
                I'm not a robot
            </label>
            </div>


          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        {/* <div className="flex justify-center gap-4 mt-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-blue-600">F</div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-blue-700">in</div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black">G</div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-purple-600">O</div>
        </div> */}
      </div>
    </div>
  );
};

export default SignUp;
