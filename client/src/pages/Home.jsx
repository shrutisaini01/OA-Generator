import { Link } from 'react-router-dom';

const Home = () => {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
        <div className="absolute top-4 right-6 space-x-4">
        <Link to="/signin">
          <button className="px-4 py-2 text-sm font-medium text-[#347433] border border-[#347433] rounded hover:bg-[#347433] hover:text-white transition">Sign In</button>
        </Link>
        <Link to="/signup">
          <button className="px-4 py-2 text-sm font-medium bg-[#347433] text-white rounded hover:bg-[#2c5f2e] transition">Sign Up</button>
        </Link>
      </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">OA Generator</h1>
          <div className="flex flex-col items-center space-y-4">
          <Link to="/coding">
          <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition text-wrap break-words">Coding</button>
          </Link>
          <Link to="/starttest?category=coding-cs">
          <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition text-wrap break-words">Coding + CS Fundamentals</button>
          </Link>
          <Link to="/starttest?category=cs">
          <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition text-wrap break-words">CS Fundamentals</button>
          </Link>
          <Link to="/starttest?category=english">
          <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition text-wrap break-words">Reasoning + Verbal</button>
          </Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;
  