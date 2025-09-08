import { useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();       // context update
    navigate('/login'); // এখানে navigate ব্যবহার করা যাবে
  };
  console.log('User in Navbar:', user); // Debug log

  return (
    <nav className="navbar">
      
      <Link to="/home" className="text-xl">KnowledgeLink</Link>
      
      {user && (
        <div className="space-x-4">
          <span><b>Welcome, {user.firstName}</b></span>
          {/* <input type="text" placeholder="Search..." aria-label="Search" /> */}
          <Link to="/courses">Courses</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/profile">Profile</Link>
          {user.role === 'Admin' && <Link to="/admin-dashboard">Admin Dashboard</Link>}
          {user.role === 'Moderator' && <Link to="/moderator-dashboard">Moderator Dashboard</Link>}
          {user.role === 'Teacher' && <Link to="/teacher-dashboard">Teacher Dashboard</Link>}
          <button onClick={handleLogout} className="btn-primary" >Logout</button>
        </div>
      )}
      {!user && (
        <div className="space-x-4">
          <Link to="/signup" className="btn-primary">Sign Up</Link>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;