const express = require('express');
const router = express.Router();
const { uploadSyllabus, getSyllabusBySession } = require('../controllers/syllabusController');
const { protect } = require('../middleware/authMiddleware'); // optional, if using auth

// @route   POST /api/syllabus
// @desc    Upload a syllabus file
// @access  Private (only logged-in users can upload)
router.post('/', protect, uploadSyllabus);

// @route   GET /api/syllabus
// @desc    Get all syllabi or filter by session (query parameter)
// @access  Public
router.get('/', async (req, res) => {
  const { session } = req.query;
  try {
    const query = session ? { session } : {};
    const syllabi = await require('../models/Syllabus').find(query).populate('uploadedBy', 'firstName lastName');
    res.json(syllabi);
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional: GET by session param (e.g., /api/syllabus/2023)
router.get('/:session', getSyllabusBySession);

module.exports = router;
