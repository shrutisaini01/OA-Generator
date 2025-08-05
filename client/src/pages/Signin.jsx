import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://oa-generator.onrender.com/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        // Use a modal or message box instead of alert()
        alert(`Welcome back, ${data.user.name || username}`);
        localStorage.setItem('user', JSON.stringify({
          name: data.user.name || username,
          institution: data.user.institution || 'Not Provided',
        }));    
        navigate('/');
      } else {
        // Use a modal or message box instead of alert()
        alert(data.message || 'Signin failed');
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
    localStorage.setItem('user', JSON.stringify(decoded));
    navigate('/'); 
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
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Log in</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          New user?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register Now
          </span>
        </p>

        <div className="mb-6 flex justify-center">
          {/* Note: The GoogleLogin component is provided by a third-party library, so its internal styling cannot be changed with Tailwind. */}
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
          <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm font-medium">or</span>
          <hr className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or Email"
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

          <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-400 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-green-600 dark:accent-green-400" />
              Remember Me
            </label>
            <a href="#" className="text-blue-500 hover:underline">Forgot password</a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg shadow-md hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> &{' '}
          <a href="#" className="text-blue-500 hover:underline">Cookie Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
