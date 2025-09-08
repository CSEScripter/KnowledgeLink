import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ApprovalCard from '../components/ApprovalCard';
import CourseCard from '../components/CourseCard';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ title: '', courseCode: '' });
  const [roleForm, setRoleForm] = useState({ userId: '', role: '' });
  const [syllabusForm, setSyllabusForm] = useState({ session: '', file: null });
  const [error, setError] = useState('');

  // Pagination states
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesTotalPages, setCoursesTotalPages] = useState(1);
  const [materialsPage, setMaterialsPage] = useState(1);
  const [materialsTotalPages, setMaterialsTotalPages] = useState(1);
  const [blogsPage, setBlogsPage] = useState(1);
  const [blogsTotalPages, setBlogsTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, materialRes, blogRes, userRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses?page=${coursesPage}&limit=10`),
          axios.get(`http://localhost:5000/api/materials/pending?page=${materialsPage}&limit=10`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`http://localhost:5000/api/blogs/pending?page=${blogsPage}&limit=10`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setCourses(courseRes.data.courses);
        setCoursesTotalPages(courseRes.data.pages);

        setMaterials(materialRes.data.materials);
        setMaterialsTotalPages(materialRes.data.pages);

        setBlogs(blogRes.data.blogs);
        setBlogsTotalPages(blogRes.data.pages);

        setUsers(userRes.data);
        setError('');
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Error fetching data:', err);
      }
    };
    if (user?.role === 'Admin') fetchData();
  }, [user, coursesPage, materialsPage, blogsPage]);

  // Create Course
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Course created');
      setFormData({ title: '', courseCode: '' });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating course');
    }
  };

  // Assign Role
  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${roleForm.userId}/role`, 
        { role: roleForm.role },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Role assigned');
      setRoleForm({ userId: '', role: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning role');
    }
  };

  // Upload Syllabus
  const handleSyllabusSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('session', syllabusForm.session);
    form.append('file', syllabusForm.file);

    try {
      await axios.post('http://localhost:5000/api/syllabus', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Syllabus uploaded');
      setSyllabusForm({ session: '', file: null });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading syllabus');
    }
  };

  // ✅ NEW: Edit Course
  const handleEditCourse = (course) => {
    const newTitle = prompt("Enter new course title", course.title);
    const newCode = prompt("Enter new course code", course.courseCode);

    if (!newTitle || !newCode) return;

    axios.put(`http://localhost:5000/api/courses/${course._id}`, {
      title: newTitle,
      courseCode: newCode
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      alert("Course updated");
      window.location.reload();
    })
    .catch(err => {
      alert(err.response?.data?.message || "Error updating course");
    });
  };

  // ✅ NEW: Delete Course
  const handleDeleteCourse = (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      alert("Course deleted");
      window.location.reload();
    })
    .catch(err => {
      alert(err.response?.data?.message || "Error deleting course");
    });
  };

  if (user?.role !== 'Admin') return <div className="container text-center">Access denied</div>;

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}

      {/* Create Course */}
      <div className="card mb-4">
        <h3 className="text-xl mb-4">Create Course</h3>
        <form onSubmit={handleCourseSubmit}>
          <label htmlFor="courseTitle" className="mb-2">Course Title</label>
          <input
            id="courseTitle"
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-4"
          />
          <label htmlFor="courseCode" className="mb-2">Course Code</label>
          <input
            id="courseCode"
            type="text"
            name="courseCode"
            placeholder="Course Code"
            value={formData.courseCode}
            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            className="mb-4"
          />
          <button type="submit" className="btn-primary">Create Course</button>
        </form>
      </div>

      {/* Courses List */}
      <div className="card mb-4">
        <h3 className="text-xl mb-4">Current Courses</h3>
        <div className="grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isAdmin={true} // ✅ New prop
                onEdit={() => handleEditCourse(course)} // ✅ New prop
                onDelete={() => handleDeleteCourse(course._id)} // ✅ New prop
              />
            ))
          ) : (
            <p className="text-center">No courses available</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-4 my-4">
          <button
            onClick={() => setCoursesPage(p => Math.max(p - 1, 1))}
            disabled={coursesPage === 1}
            className="btn-primary"
          >
            Previous
          </button>
          <span>Page {coursesPage} of {coursesTotalPages}</span>
          <button
            onClick={() => setCoursesPage(p => Math.min(p + 1, coursesTotalPages))}
            disabled={coursesPage === coursesTotalPages}
            className="btn-primary"
          >
            Next
          </button>
        </div>
      </div>

      {/* Assign Role */}
      <div className="card mb-4">
        <h3 className="text-xl mb-4">Assign Role</h3>
        <form onSubmit={handleRoleSubmit}>
          <label htmlFor="userId" className="mb-2">Select User</label>
          <select
            id="userId"
            name="userId"
            value={roleForm.userId}
            onChange={(e) => setRoleForm({ ...roleForm, userId: e.target.value })}
            className="mb-4"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.email})</option>
            ))}
          </select>
          <label htmlFor="role" className="mb-2">Select Role</label>
          <select
            id="role"
            name="role"
            value={roleForm.role}
            onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
            className="mb-4"
          >
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Moderator">Moderator</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" className="btn-primary">Assign Role</button>
        </form>
      </div>

      {/* Upload Syllabus */}
      <div className="card mb-4">
        <h3 className="text-xl mb-4">Upload Syllabus</h3>
        <form onSubmit={handleSyllabusSubmit}>
          <label htmlFor="session" className="mb-2">Session</label>
          <input
            id="session"
            type="text"
            name="session"
            placeholder="Session (e.g., 2020-2021)"
            value={syllabusForm.session}
            onChange={(e) => setSyllabusForm({ ...syllabusForm, session: e.target.value })}
            className="mb-4"
          />
          <label htmlFor="syllabusFile" className="mb-2">Syllabus File</label>
          <input
            id="syllabusFile"
            type="file"
            accept=".pdf"
            onChange={(e) => setSyllabusForm({ ...syllabusForm, file: e.target.files[0] })}
            className="mb-4"
          />
          <button type="submit" className="btn-primary">Upload Syllabus</button>
        </form>
      </div>

      {/* Pending Materials */}
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
      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={() => setMaterialsPage(p => Math.max(p - 1, 1))}
          disabled={materialsPage === 1}
          className="btn-primary"
        >
          Previous
        </button>
        <span>Page {materialsPage} of {materialsTotalPages}</span>
        <button
          onClick={() => setMaterialsPage(p => Math.min(p + 1, materialsTotalPages))}
          disabled={materialsPage === materialsTotalPages}
          className="btn-primary"
        >
          Next
        </button>
      </div>

      {/* Pending Blogs */}
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
      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={() => setBlogsPage(p => Math.max(p - 1, 1))}
          disabled={blogsPage === 1}
          className="btn-primary"
        >
          Previous
        </button>
        <span>Page {blogsPage} of {blogsTotalPages}</span>
        <button
          onClick={() => setBlogsPage(p => Math.min(p + 1, blogsTotalPages))}
          disabled={blogsPage === blogsTotalPages}
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
