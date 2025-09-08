import axios from 'axios';

function ApprovalCard({ item, type, refresh }) {
  const handleApprove = async (isApproved) => {
    try {
      await axios.put(
        `http://localhost:5000/api/${type}/${item._id}/approve`,
        { isApproved },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(`${type} ${isApproved ? 'approved' : 'rejected'}`);
      refresh();
    } catch (error) {
      alert(`Error updating ${type}`);
      console.error(`Error updating ${type}:`, error);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg mb-2">{item.title}</h3>
      {type === 'materials' && (
        <div className="space-y-2">
          <p>Course: {item.course.title}</p>
          <p>Category: {item.category}</p>
          <p>Uploader: {item.uploader.firstName} {item.uploader.lastName}</p>
          <a
            href={`http://localhost:5000/${item.filePath}`}
            className="btn-primary w-full mt-2"
            download
            aria-label={`Download material ${item.title}`}
          >
            Download
          </a>
        </div>
      )}
      {type === 'blogs' && (
        <div className="space-y-2">
          <p>Author: {item.author.firstName} {item.author.lastName}</p>
          <p className="mb-2">{item.content.substring(0, 100)}...</p>
        </div>
      )}
      <hr className="approval-divider my-4" />
      <div className="space-x-4 text-center">
        <button
          onClick={() => handleApprove(true)}
          className="btn-primary"
          aria-label={`Approve ${type} ${item.title}`}
        >
          Approve
        </button>
        <button
          onClick={() => handleApprove(false)}
          className="btn-danger"
          aria-label={`Reject ${type} ${item.title}`}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default ApprovalCard;