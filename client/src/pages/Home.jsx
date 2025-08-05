import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LogOut,
  BookOpenText,
  Code,
  GraduationCap,
  Briefcase,
  ChevronRight,
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
      text: 'Coding + CS Fundamentals',
      to: '/starttest?category=coding-cs',
      icon: <GraduationCap size={20} />,
    },
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
  ];

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-emerald-50 to-emerald-200 font-inter p-4">
      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 bg-white/50 backdrop-blur-md rounded-full p-2 shadow-lg">
        {!user ? (
          <>
            <Link to="/signin">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-800 border-2 border-emerald-800 rounded-full hover:bg-emerald-800 hover:text-white transition-all duration-300 transform hover:scale-105">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-800 text-white rounded-full hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105">
                Sign Up
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
      <div className="text-center bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl max-w-4xl w-full">
        {user ? (
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-extrabold text-emerald-900 mb-2 leading-tight">
              Hey welcome, {user.name || user.username}!
            </h2>
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              Give an edge to your preparations by attempting the tests!
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-emerald-900 leading-tight">
              OA Generator
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Your pathway to success in online assessments.
            </p>
          </div>
        )}

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testButtons.map((button) => (
            <Link key={button.text} to={button.to}>
              <button className="w-full flex items-center justify-between bg-emerald-700 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-4 relative group overflow-hidden">
                <span className="flex items-center gap-4 z-10">
                  {button.icon} {button.text}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
