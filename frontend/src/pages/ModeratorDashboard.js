import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ApprovalCard from '../components/ApprovalCard';

function ModeratorDashboard() {
  const { user } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPagesMaterials, setTotalPagesMaterials] = useState(1);
  const [totalPagesBlogs, setTotalPagesBlogs] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
  try {
    const [materialRes, blogRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/materials/pending?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
      axios.get(`http://localhost:5000/api/blogs/pending?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    ]);
    setMaterials(materialRes.data.materials);
    setBlogs(blogRes.data.blogs);
    setTotalPagesMaterials(materialRes.data.pages);
    setTotalPagesBlogs(blogRes.data.pages);
    setError('');
  } catch (err) {
    setError('Failed to load dashboard data. Please try again.');
    console.error('Error fetching data:', err);
  }
};

    if (user?.role === 'Moderator') fetchData();
  }, [user, page]);

  if (user?.role !== 'Moderator') return <div className="container text-center">Access denied</div>;

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">Moderator Dashboard</h2>
      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
      <h3 className="text-xl mb-4">Pending Approvals</h3>
      <h4 className="text-lg mb-2">Materials</h4>
      <div className="grid">
        {materials.length > 0 ? (
          materials.map((material) => (
            <ApprovalCard key={material._id} item={material} type="materials" refresh={() => window.location.reload()} />
          ))
        ) : (
          <p className="text-center">No pending materials</p>
        )}
      </div>
      <div className="space-x-4 mt-4 text-center">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="btn-primary"
          aria-label="Previous page for materials"
        >
          Previous
        </button>
        <span aria-live="polite">Page {page} of {totalPagesMaterials}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPagesMaterials))}
          disabled={page === totalPagesMaterials}
          className="btn-primary"
          aria-label="Next page for materials"
        >
          Next
        </button>
      </div>
      <h4 className="text-lg mb-2 mt-4">Blogs</h4>
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
          aria-label="Previous page for blogs"
        >
          Previous
        </button>
        <span aria-live="polite">Page {page} of {totalPagesBlogs}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPagesBlogs))}
          disabled={page === totalPagesBlogs}
          className="btn-primary"
          aria-label="Next page for blogs"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ModeratorDashboard;