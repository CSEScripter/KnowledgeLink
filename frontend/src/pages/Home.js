import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import CourseCard from '../components/CourseCard';
import useDebounce from '../utils/useDebounce';

function Home() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = debouncedSearchQuery
          ? await axios.get(`http://localhost:5000/api/search?q=${debouncedSearchQuery}&page=${page}&limit=10`)
          : await axios.get(`http://localhost:5000/api/courses?page=${page}&limit=10`);
        setCourses(debouncedSearchQuery ? res.data.courses : res.data.courses);
        setTotalPages(res.data.pages);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [debouncedSearchQuery, page]);

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <Sidebar />
      <div className="container">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 w-full max-w-md"
          aria-label="Search courses"
        />
        <div className="grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p className="text-center">No courses found</p>
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
    </div>
  );
}

export default Home;