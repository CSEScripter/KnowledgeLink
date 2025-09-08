import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function GetStarted() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to /home if user is logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="card max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to KnowledgeLink</h1>
        <p className="text-lg mb-8">
          Your platform for accessing courses, study materials, blogs, and more. Join our community to start learning today!
        </p>
        <div className="space-x-4">
          <Link to="/signup" className="btn-primary inline-block px-6 py-3">
            Sign Up
          </Link>
          <Link to="/login" className="btn-primary inline-block px-6 py-3">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;