const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('Admin'), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourse);

// NEW: Update course
router.put('/:id', protect, restrictTo('Admin'), updateCourse);

// NEW: Delete course
router.delete('/:id', protect, restrictTo('Admin'), deleteCourse);

module.exports = router;
