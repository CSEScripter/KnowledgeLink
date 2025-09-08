import { Link } from 'react-router-dom';

function CourseCard({ course, isAdmin, onEdit, onDelete }) {
  return (
    <div className="card">
      <h3 className="text-lg">{course.title}</h3>
      <p>Course Code: {course.courseCode}</p>
      <Link to={`/courses/${course._id}`} className="btn-primary w-full mt-2">View Details</Link>
     <hr className="approval-divider my-4" />
      {isAdmin && (
        <div className="space-x-4 text-center">
          <button onClick={onEdit} className="btn-secondary edit-btn">Edit</button>
          <button onClick={onDelete} className="btn-danger delete-btn">Delete</button>
        </div>
      )}
    </div>
  );
}

export default CourseCard;
