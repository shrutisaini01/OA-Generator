import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Coding from './pages/Coding';
import CodingCS from './pages/CodingCS';
import CS from './pages/CS'
import English from './pages/English';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import StartTest from './pages/StartTest';
import DSATestPage from './pages/DSATestPage';
import DevTestPage from './pages/DevTestPage';
import MLTestPage from './pages/MLTestPage';
import Progress from './pages/Progress';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coding" element={<Coding />} />
        <Route path="/coding-cs" element={<CodingCS />} />
        <Route path="/cs" element={<CS />} />
        <Route path="/english" element={<English />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/starttest" element={<StartTest />} />
        <Route path="/coding/dsa" element={<DSATestPage />} />
        <Route path="/coding/development" element={<DevTestPage />} />
        <Route path="/coding/machine_learning" element={<MLTestPage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;