import { LogIn } from 'lucide-react';
import './App.css';
import Login from './pages/Login'
import Home from './pages/home';
import Track from './pages/track';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './middleware/authProvider';
import PrivateRoute from './middleware/privateProvider';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/track" element={
            <PrivateRoute>
              <Track />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
