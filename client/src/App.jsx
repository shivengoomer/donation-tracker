import './App.css';
import Home from './pages/home';
import Track from './pages/track';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </Router>
  );
}

export default App;
