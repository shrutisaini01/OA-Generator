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
  const [isHuman, setIsHuman] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://oa-generator.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password, college, provider: 'local' }),
      });
  
      const data = await res.json();
      if (res.ok) {
        // Use a modal or message box instead of alert()
        alert(`Welcome, ${name}! You're signed up.`);
        navigate('/signin');
      } else {
        // Use a modal or message box instead of alert()
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      // Use a modal or message box instead of alert()
      alert('Something went wrong');
    }
  };
  
  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Google user info:', decoded);
    // Note: Assuming `decoded` contains `name` and `email` properties.
    setName(decoded.name || '');
    setUsername(decoded.email || ''); // Often, email is used as username for Google sign-ups
    // Additional state updates for other fields from Google data can go here
    navigate('/home'); 
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-6 right-6 z-10">
        <Link to="/">
          <button className="px-5 py-2 text-sm font-semibold text-green-700 dark:text-green-400 border-2 border-green-700 dark:border-green-400 rounded-full hover:bg-green-700 dark:hover:bg-green-400 hover:text-white dark:hover:text-gray-900 transition-all duration-300">
            Home
          </button>
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl transition-colors duration-300">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Create Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Already have an account? <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/signin')}>Log in</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Institution / Organization</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Enter Institution name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notRobot"
              checked={isHuman}
              onChange={(e) => setIsHuman(e.target.checked)}
              className="accent-green-600 dark:accent-green-400 w-4 h-4 cursor-pointer"
              required
            />
            <label htmlFor="notRobot" className="text-sm text-gray-700 dark:text-gray-400">
              I'm not a robot
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
          <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm font-medium">or</span>
          <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
