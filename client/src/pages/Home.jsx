import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // Optional: force redirect
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100 relative px-4">
      
      {/* Top Right Controls */}
      <div className="absolute top-4 right-6 space-x-4">
        {!user ? (
          <>
            <Link to="/signin">
              <button className="px-4 py-2 text-sm font-medium text-[#347433] border border-[#347433] rounded hover:bg-[#347433] hover:text-white transition">Sign In</button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 text-sm font-medium bg-[#347433] text-white rounded hover:bg-[#2c5f2e] transition">Sign Up</button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium bg-[#2c5f2e] text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>

      <div className="text-center">
        {/* Welcome message */}
        {user ? (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#347433] mb-6">
            Hey welcome {user.name || user.username}!<br />
            <span className="text-lg sm:text-xl text-gray-700">Give an edge to your preparations by attempting the tests!</span>
          </h2>
        ) : (
          <h1 className="text-4xl font-bold mb-6 text-[#347433]">OA Generator</h1>
        )}

        {/* Test Buttons */}
        <div className="flex flex-col items-center space-y-4">
          <Link to="/coding">
            <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition">
              Coding
            </button>
          </Link>
          <Link to="/starttest?category=coding-cs">
            <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition">
              Coding + CS Fundamentals
            </button>
          </Link>
          <Link to="/starttest?category=cs">
            <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition">
              CS Fundamentals
            </button>
          </Link>
          <Link to="/starttest?category=english">
            <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition">
              Reasoning + Verbal
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
