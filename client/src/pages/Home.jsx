import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LogOut,
  BookOpenText,
  Code,
  GraduationCap,
  Briefcase,
  ChevronRight,
  UserPlus,
  LogIn,
} from 'lucide-react';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const testButtons = [
    { text: 'Coding', to: '/coding', icon: <Code size={20} /> },
    {
      text: 'CS Fundamentals',
      to: '/starttest?category=cs',
      icon: <BookOpenText size={20} />,
    },
    {
      text: 'Reasoning + Verbal',
      to: '/starttest?category=english',
      icon: <Briefcase size={20} />,
    },
    {
      text: 'Progress',
      to: '/progress',
      icon: <GraduationCap size={20} />,
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 font-inter p-4">
      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 bg-gray-800/50 backdrop-blur-md rounded-full p-2 shadow-lg border border-gray-700">
        {!user ? (
          <>
            <Link to="/signin">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-300 border-2 border-emerald-300 rounded-full hover:bg-emerald-300 hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                <LogIn size={16} /> Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
                <UserPlus size={16} /> Sign Up
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="text-center bg-gray-800/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl max-w-4xl w-full border border-gray-700">
        {user ? (
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Hey welcome, {user.name || user.username}!
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-medium">
              Give an edge to your preparations by attempting the tests!
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 leading-tight">
              OA Generator
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-medium">
              Your pathway to success in online assessments.
            </p>
          </div>
        )}

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testButtons.map((button) => (
            <Link key={button.text} to={button.to}>
              <button className="w-full flex items-center justify-between bg-gray-700 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-4 relative group overflow-hidden border border-gray-600">
                <span className="flex items-center gap-4 z-10 text-gray-100">
                  {button.icon} {button.text}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-gray-100">
                  <ChevronRight size={24} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
