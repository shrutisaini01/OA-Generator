import { Link } from 'react-router-dom';
import { LayoutDashboard, Code, Lightbulb, GraduationCap } from 'lucide-react';

const Coding = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 font-sans">
      <div className="absolute top-8 right-8">
        <Link to="/">
          <button className="flex items-center space-x-2 px-6 py-2 text-sm font-semibold text-emerald-300 border border-emerald-300 rounded-full hover:bg-emerald-300 hover:text-gray-900 transition-all duration-300 shadow-lg">
            <LayoutDashboard size={18} />
            <span>Home</span>
          </button>
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Choose Your Coding Category
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Select a category to start your test and challenge your skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* DSA Card */}
        <Link to="/starttest?category=dsa" className="group">
          <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:scale-105 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20">
            <Code size={48} className="text-emerald-400 mb-4 transition-all duration-300 group-hover:scale-110" />
            <h2 className="text-xl font-bold text-gray-100 mb-2">DSA</h2>
            <p className="text-sm text-gray-400 text-center">
              Algorithms and Data Structures
            </p>
          </div>
        </Link>

        {/* Development Card */}
        <Link to="/starttest?category=development" className="group">
          <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20">
            <Lightbulb size={48} className="text-blue-400 mb-4 transition-all duration-300 group-hover:scale-110" />
            <h2 className="text-xl font-bold text-gray-100 mb-2">Development</h2>
            <p className="text-sm text-gray-400 text-center">
              Web, Mobile, and Software
            </p>
          </div>
        </Link>

        {/* Machine Learning Card */}
        <Link to="/starttest?category=machine_learning" className="group">
          <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20">
            <GraduationCap size={48} className="text-purple-400 mb-4 transition-all duration-300 group-hover:scale-110" />
            <h2 className="text-xl font-bold text-gray-100 mb-2">Machine Learning</h2>
            <p className="text-sm text-gray-400 text-center">
              AI, Data Science, and Models
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Coding;
