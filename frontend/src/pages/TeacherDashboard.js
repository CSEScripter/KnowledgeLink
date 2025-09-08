import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ApprovalCard from '../components/ApprovalCard';

function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/pending?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBlogs(res.data.blogs);
      setTotalPages(res.data.pages);
      setError('');
    } catch (err) {
      setError('Failed to load blogs. Please try again.');
      console.error('Error fetching blogs:', err);
    }
  };
  if (user?.role === 'Teacher') fetchBlogs();
}, [user, page]);


  if (user?.role !== 'Teacher') return <div className="container text-center">Access denied</div>;

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">Teacher Dashboard</h2>
      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
      <h3 className="text-xl mb-4">Pending Blog Approvals</h3>
      <div className="grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <ApprovalCard key={blog._id} item={blog} type="blogs" refresh={() => window.location.reload()} />
          ))
        ) : (
          <p className="text-center">No pending blogs</p>
        )}
      </div>
      <div className="space-x-4 mt-4 text-center">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="btn-primary"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span aria-live="polite">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="btn-primary"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TeacherDashboard;