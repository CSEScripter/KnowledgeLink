const Course = require('../models/Course');
const Material = require('../models/Material');
const Blog = require('../models/Blog');

// @desc    Search courses, materials, and blogs
// @route   GET /api/search?q=:query
exports.search = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const courses = await Course.find({ title: { $regex: q, $options: 'i' } })
      .populate('createdBy', 'firstName lastName');
    const materials = await Material.find({ title: { $regex: q, $options: 'i' }, isApproved: true })
      .populate('uploader', 'firstName lastName')
      .populate('course', 'title courseCode');
    const blogs = await Blog.find({ title: { $regex: q, $options: 'i' }, isApproved: true })
      .populate('author', 'firstName lastName');

    res.json({ courses, materials, blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};