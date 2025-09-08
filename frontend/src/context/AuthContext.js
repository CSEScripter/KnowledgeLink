import { createContext, useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log('Auth/me response:', res.data); // Debug log
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Auth/me error:', err);
          setError('Failed to authenticate. Please log in again.');
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (firstName, lastName, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
      });
      console.log('Signup response:', res.data); // Debug log
      // localStorage.setItem('token', res.data.token);
      // setUser(res.data.user);
      setError('');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Error signing up. Please try again.');
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log('Login response:', res.data); // Debug log
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setError('');
      //navigate('/home'); // Redirect to home page
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Error logging in. Please check your credentials.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError('');
    //navigate('/login'); // Redirect to GetStarted page
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};