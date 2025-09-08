import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Please fill in both email and password');
      return;
    }
    console.log('Login payload:', formData); // Debug log
    try {
      await login(formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="h-screen">
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
        <label htmlFor="email" className="mb-2">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4"
          aria-required="true"
        />
        <label htmlFor="password" className="mb-2">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4"
          aria-required="true"
        />
        <button type="submit" className="btn-primary w-full signup-login">Login</button>
      </form>
    </div>
  );
}

export default Login;