import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../middleware/authProvider'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup
      ? 'http://localhost:5000/api/user/signup'
      : 'http://localhost:5000/api/user/login';

    try {
      await axios.post(endpoint, formData, {
        withCredentials: true,
      });
      const res = await axios.get('http://localhost:5000/api/user/me', {
        withCredentials: true,
      });

      setUser(res.data);
      alert("Login Succesfull!")
      if(res.data.isAdmin){ navigate('/admin')}
      else{navigate('/track')};

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/logout', {}, {
        withCredentials: true,
      });
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white text-center">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.username} 👋</h2>
        <p className="text-gray-600">Email: {user.email}</p>

        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isSignup ? 'Sign Up' : 'Login'}
      </h2>

      {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {isSignup && (
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            setIsSignup(!isSignup);
            setFormData({ username: '', email: '', password: '' });
            setError('');
          }}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
