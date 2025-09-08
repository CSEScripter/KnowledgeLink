import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function EditProfile() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    fatherName: user?.fatherName || '',
    motherName: user?.motherName || '',
    phoneNumber: user?.phoneNumber || '',
    bloodGroup: user?.bloodGroup || '',
    session: user?.session || '',
    semester: user?.semester || '',
    socialLinks: JSON.stringify(user?.socialLinks || {}),
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach(key => form.append(key, formData[key]));
    if (file) form.append('profilePicture', file);

    try {
      await axios.put('http://localhost:5000/api/users/profile', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  if (!user) return <div>Please log in</div>;

  return (
    <div className="h-screen ">
      <form onSubmit={handleSubmit} className="card edit-profile-card">
        <h2 className="text-2xl mb-4">Edit Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="fatherName">Father's Name</label>
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          value={formData.fatherName}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="motherName">Mother's Name</label>
        <input
          type="text"
          name="motherName"
          placeholder="Mother's Name"
          value={formData.motherName}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="bloodGroup">Blood Group</label>
        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="mb-4">
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        <label htmlFor="session">Session</label>
        <input
          type="text"
          name="session"
          placeholder="Session (e.g., 2020-2021)"
          value={formData.session}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="semester">Semester</label>
        <select name="semester" value={formData.semester} onChange={handleChange} className="mb-4">
          <option value="">Select Semester</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="3rd">3rd</option>
          <option value="4th">4th</option>
          <option value="5th">5th</option>
          <option value="6th">6th</option>
          <option value="7th">7th</option>
          <option value="8th">8th</option>
        </select>
        <label htmlFor="socialLinks">Social Links</label>
        <input
          type="text"
          name="socialLinks"
          placeholder='Social Links (e.g., {"facebook": "url", "linkedin": "url"})'
          value={formData.socialLinks}
          onChange={handleChange}
          className="mb-4"
        />
        <label htmlFor="profilePicture">Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <button type="submit" className="btn-primary w-full signup-login">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;