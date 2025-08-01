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
      const res = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(`Welcome back, ${data.user.name || username}`);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        alert(data.message || 'Signin failed');
      }
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-white bg-opacity-50 flex items-center justify-center px-4">
      <div className="absolute top-4 right-6 space-x-4">
        <Link to="/">
          <button className="px-4 py-2 text-sm font-medium text-[#347433] border border-[#347433] rounded hover:bg-[#347433] hover:text-white transition">Home</button>
        </Link>
        </div>
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Log in</h2>
        <p className="text-sm text-gray-700 mb-4">
          New user?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register Now
          </span>
        </p>

        <div className="mb-4 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        {/* <div className="flex justify-center gap-4 mb-4">
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-blue-600 text-xl">f</div>
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-blue-700 text-xl">in</div>
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-xl">GH</div>
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-purple-600 text-xl">O</div>
        </div> */}

        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or Email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-green-700" />
              Remember Me
            </label>
            <a href="#" className="text-blue-600 hover:underline">Forgot password</a>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> &{' '}
          <a href="#" className="text-blue-600 hover:underline">Cookie Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
