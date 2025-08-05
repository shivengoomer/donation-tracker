import { LogIn } from 'lucide-react';
import './App.css';
import Login from './pages/Login'
import Home from './pages/home';
import Track from './pages/track';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
