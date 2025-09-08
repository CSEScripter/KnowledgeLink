import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(res.data.blogs || []);
        setError('');
      } catch (err) {
        setError('Failed to load blogs. Please try again.');
        console.error('Error fetching blogs:', err);
      }
    };
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Please provide both title and content');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/blogs', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Blog submitted');
      setFormData({ title: '', content: '' });
      setBlogs([res.data, ...blogs]); // Add new blog to state
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting blog');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container">
      <h1 className="text-2xl text-center mb-4">KnowledgeLink Blogs</h1>
      {user && (
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="card">
            <h2 className="text-xl mb-4">Write a Blog</h2>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <label htmlFor="blogTitle" className="mb-2">Title</label>
            <input
              id="blogTitle"
              type="text"
              name="title"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mb-4"
              aria-required="true"
            />
            <label htmlFor="blogContent" className="mb-2">Content</label>
            <textarea
              id="blogContent"
              name="content"
              placeholder="Write your blog content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mb-4"
              rows="6"
              aria-required="true"
            />
            <button type="submit" className="btn-primary w-full">Submit Blog</button>
          </form>
        </div>
      )}
      <p className="blog-title">Available Blogs</p>
      <div className="grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="card">
              <h3 className="text-lg mb-2">{blog.title}</h3>
              <p className="mb-2">{blog.content?.substring(0, 150) || ''}...</p>
              <div className="blog-meta space-y-2">
                <span>By {blog.author?.firstName || ''} {blog.author?.lastName || ''}</span>
                <span> | </span>
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <button
                onClick={() => navigate(`/blogs/${blog._id}`)}
                className="btn-primary mt-2"
                aria-label={`Read full blog ${blog.title}`}
              >
                Read More
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-lg">No blogs available</p>
        )}
      </div>
    </div>
  );
}

export default Blogs;