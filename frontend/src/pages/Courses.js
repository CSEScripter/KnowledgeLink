import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses?page=${page}&limit=10`);
        setCourses(res.data.courses);
        setTotalPages(res.data.pages);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [page]);

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">All Courses</h2>
      <div className="grid">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
      <div className="space-x-4 mt-4 text-center">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="btn-primary"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Courses;