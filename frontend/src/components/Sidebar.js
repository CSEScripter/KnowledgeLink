import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const [session, setSession] = useState('');
  const [syllabi, setSyllabi] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSyllabi = async () => {
      try {
        const query = session ? { session } : {};
        const res = await axios.get('http://localhost:5000/api/syllabus', {
          params: query,
          headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
        });
        setSyllabi(res.data);
      } catch (error) {
        console.error('Syllabus fetch error:', error);
      }
    };
    fetchSyllabi();
  }, [session, user]);

  // প্রথম syllabus এর ফাইল ডাউনলোড করার ফাংশন
  const handleDownload = () => {
    if (syllabi.length > 0) {
      const fileUrl = `http://localhost:5000/${syllabi[0].filePath}`;
      window.open(fileUrl, '_blank');
    } else {
      alert('No syllabus found for this session.');
    }
  };

  return (
    <div className="sidebar">
      <img src="/logo.png" alt="KnowledgeLink Logo" className="logo mb-4" />

      <h2 className="text-xl mb-4">Syllabus Finder</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="session" className="mb-2">Session</label>
          <select
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="w-full mb-4"
            aria-label="Select session"
          >
            <option value="">Select Session</option>
            <option value="2020-2021">2020-2021</option>
            <option value="2021-2022">2021-2022</option>
            <option value="2022-2023">2022-2023</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
          </select>
        </div>

        <button
          onClick={handleDownload}
          className="btn-primary w-full"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
