import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load blog. Please try again.');
        console.error('Error fetching blog:', err);
      }
    };
    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (error) {
    return <div className="container text-center text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="container text-center">Loading...</div>;
  }

  return (
    <div className="container">
      <button
        onClick={() => navigate('/blogs')}
        className="btn-primary mb-4"
        aria-label="Back to blogs"
      >
        Back to Blogs
      </button>
      <div className="card">
        <h1 className="text-2xl mb-4">{blog.title}</h1>
        <div className="blog-meta space-y-2 mb-4">
          <span>By {blog.author?.firstName || ''} {blog.author?.lastName || ''}</span>
          <span> | </span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
        <p className="text-lg whitespace-pre-wrap blog-content">{blog.content}</p>
      </div>
    </div>
  );
}

export default BlogDetail;