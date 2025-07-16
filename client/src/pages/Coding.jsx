import {Link} from 'react-router-dom';

const Coding = () => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="absolute top-4 right-6 space-x-4">
        <Link to="/">
          <button className="px-4 py-2 text-sm font-medium text-[#347433] border border-[#347433] rounded hover:bg-[#347433] hover:text-white transition">Home</button>
        </Link>
        </div>
      <h1 className="text-3xl font-bold mb-6">Choose Coding Category</h1>
    <div className="flex gap-5">
        <Link to="/starttest?category=dsa">
          <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition text-wrap break-words">DSA</button>
          </Link>
          <Link to="/starttest?category=development">
          <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition text-wrap break-words">Development</button>
          </Link>
          <Link to="/starttest?category=machine_learning">
          <button className="min-w-[200px] bg-[#347433] hover:bg-[#03A6A1] text-white text-lg border-2 border-white rounded-[12px] shadow-md shadow-gray-800 px-6 py-3 hover:shadow-lg transition text-wrap break-words">Machine Learning</button>
          </Link>
          </div>
    </div>
  );
};

export default Coding;
