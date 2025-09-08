const express = require('express');
const router = express.Router();
const { createBlog, approveBlog, getBlogs,getPendingBlogs } = require('../controllers/blogController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const Blog = require('../models/Blog');

router.post('/', protect, createBlog);
router.put('/:id/approve', protect, restrictTo('Admin', 'Moderator', 'Teacher'), approveBlog);
router.get('/', getBlogs);
router.get('/pending', protect, restrictTo('Admin', 'Moderator', 'Teacher'), getPendingBlogs);

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isApproved: true }).populate('author', 'firstName lastName');
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'firstName lastName');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;