import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { signup, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      console.log('Signup successful, redirecting to /login'); // Debug log
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="h-screen">
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
        <label htmlFor="firstName" className="mb-2">First Name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="mb-4"
          aria-required="true"
        />
        <label htmlFor="lastName" className="mb-2">Last Name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="mb-4"
          aria-required="true"
        />
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
        <label htmlFor="confirmPassword" className="mb-2">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mb-4"
          aria-required="true"
        />
        <button type="submit" className="btn-primary w-full signup-login">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;