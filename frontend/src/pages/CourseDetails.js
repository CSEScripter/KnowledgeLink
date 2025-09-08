import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function CourseDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({ title: '', category: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load course details. Please try again.');
        console.error('Error fetching course:', err);
      }
    };
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/materials/course/${id}?page=${page}&limit=10`);
        setMaterials(res.data.materials);
        setTotalPages(res.data.pages);
        setError('');
      } catch (err) {
        setError('Failed to load materials. Please try again.');
        console.error('Error fetching materials:', err);
      }
    };
    fetchCourse();
    fetchMaterials();
  }, [id, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('courseId', id);
    form.append('category', formData.category);
    form.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/materials', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Material uploaded');
      setFormData({ title: '', category: '' });
      setFile(null);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading material');
    }
  };

  // Admin-only delete function
  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/materials/${materialId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Material deleted successfully');
      setMaterials(materials.filter(mat => mat._id !== materialId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting material');
      console.error('Delete error:', err);
    }
  };

  if (!course) return <div className="container text-center">Loading...</div>;

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">{course.title} ({course.courseCode})</h2>
      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}

      <h3 className="text-xl mb-4">Materials</h3>
      <div className="grid">
        {materials.length > 0 ? (
          materials.map((material) => (
            <div key={material._id} className="card">
              <p>{material.title} ({material.category})</p>
              <div className="material-actions space-x-4 text-center">
                

                





                {/* Download button */}
                <a
                  href={`http://localhost:5000/${material.filePath}`}
                  download
                  className="btn-primary"
                  aria-label={`Download ${material.title}`}
                >
                  Download
                </a>

                {/* Admin-only Delete button */}
                {user?.role === 'Admin' && (
                  <button
                    onClick={() => handleDeleteMaterial(material._id)}
                    className="btn-danger delete-btn"
                    aria-label={`Delete ${material.title}`}
                  >
                    Delete
                  </button>
                )}
                {/* View button
                <a
                  href={`http://localhost:5000/${material.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-view"
                  aria-label={`View ${material.title}`}
                >
                  View
                </a> */}
                
              </div>
              
            </div>
          ))
        ) : (
          <p className="text-center">No materials available</p>
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

      {user && (
        <form onSubmit={handleSubmit} className="card mt-8">
          <h3 className="text-xl mb-4">Upload Material</h3>
          <label htmlFor="materialTitle" className="mb-2">Title</label>
          <input
            id="materialTitle"
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-4"
            aria-required="true"
          />
          <label htmlFor="category" className="mb-2">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mb-4"
            aria-required="true"
          >
            <option value="">Select Category</option>
            <option value="Syllabus">Syllabus</option>
            <option value="Presentation">Presentation</option>
            <option value="Question">Question</option>
            <option value="Notes">Notes</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="materialFile" className="mb-2">File</label>
          <input
            id="materialFile"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
            aria-required="true"
          />
          <button type="submit" className="btn-primary">Upload</button>
        </form>
      )}
    </div>
  );
}

export default CourseDetails;
