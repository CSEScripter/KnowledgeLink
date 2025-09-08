const Blog = require('../models/Blog');

// @desc    Create a new blog
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const blog = await Blog.create({
      title,
      content,
      author: req.user.id,
      isApproved: req.user.role === 'Teacher' || req.user.role === 'Admin',
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/reject a blog
// @route   PUT /api/blogs/:id/approve
exports.approveBlog = async (req, res) => {
  const { isApproved } = req.body;

  if (typeof isApproved !== 'boolean') {
    return res.status(400).json({ message: 'isApproved must be a boolean' });
  }

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.isApproved = isApproved;
    blog.approvedBy = isApproved ? req.user.id : null;
    await blog.save();

    res.json({ message: `Blog ${isApproved ? 'approved' : 'rejected'}`, blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all approved blogs with pagination
// @route   GET /api/blogs?page=1&limit=10
exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Blog.countDocuments({ isApproved: true });
    const blogs = await Blog.find({ isApproved: true })
      .populate('author', 'firstName lastName')
      .skip(skip)
      .limit(limit);
    res.json({ blogs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc Get pending blogs with pagination
// @route GET /api/blogs/pending?page=1&limit=10
exports.getPendingBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Blog.countDocuments({ isApproved: false });
    const blogs = await Blog.find({ isApproved: false })
      .populate('author', 'firstName lastName')
      .skip(skip)
      .limit(limit);

    res.json({ blogs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

