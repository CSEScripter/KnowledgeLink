import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/materials/user?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMaterials(res.data.materials);
        setTotalPages(res.data.pages);
        setError('');
      } catch (err) {
        setError('Failed to load materials. Please try again.');
        console.error('Error fetching materials:', err);
      }
    };
    if (user) fetchMaterials();
  }, [user, page]);

  if (!user) return <div className="container text-center">Please log in</div>;

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">Profile</h2>
      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
      <div className="card mb-4">
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
        {user.fatherName && <p><strong>Father's Name:</strong> {user.fatherName}</p>}
        {user.motherName && <p><strong>Mother's Name:</strong> {user.motherName}</p>}
        {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
        {user.bloodGroup && <p><strong>Blood Group:</strong> {user.bloodGroup}</p>}
        {user.session && <p><strong>Session:</strong> {user.session}</p>}
        {user.semester && <p><strong>Semester:</strong> {user.semester}</p>}
        {user.socialLinks && Object.keys(user.socialLinks).map(key => (
          user.socialLinks[key] && <p key={key}><strong>{key}:</strong> <a href={user.socialLinks[key]} target="_blank" rel="noopener noreferrer">{user.socialLinks[key]}</a></p>
        ))}
        <Link to="/edit-profile" className="btn-primary mt-4">Edit Profile</Link>
      </div>
      <h3 className="text-xl mb-4">Uploaded Materials</h3>
      <div className="grid">
        {materials.length > 0 ? (
          materials.map((material) => (
            <div key={material._id} className="card">
              <p>{material.title} ({material.category})</p>
              <p>Course: {material.course?.title || "N/A"}</p>

              <p>Status: {material.isApproved ? 'Approved' : 'Pending'}</p>
              <a href={`http://localhost:5000/${material.filePath}`} className="btn-primary mt-2" download>Download</a>
            </div>
          ))
        ) : (
          <p className="text-center">No materials uploaded</p>
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

export default Profile;