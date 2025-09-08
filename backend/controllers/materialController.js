const Material = require('../models/Material');
const multer = require('multer');
const path = require('path');

// Multer setup for material uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx||mp4|jpg|jpeg|png|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Allowed file types: pdf, doc, docx, mp4, jpg, jpeg, png, xls, xlsx');
  },
});

// @desc    Upload a material
// @route   POST /api/materials
exports.uploadMaterial = [
  upload.single('file'),
  async (req, res) => {
    const { title, courseId, category } = req.body;

    if (!title || !courseId || !category || !req.file) {
      return res.status(400).json({ message: 'All fields and file are required' });
    }

    try {
      const material = await Material.create({
        title,
        course: courseId,
        uploader: req.user.id,
        filePath: req.file.path,
        fileType: path.extname(req.file.originalname).slice(1),
        category,
        isApproved: req.user.role === 'Teacher' || req.user.role === 'Admin',
      });

      res.status(201).json(material);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// @desc    Approve/reject a material
// @route   PUT /api/materials/:id/approve
exports.approveMaterial = async (req, res) => {
  const { isApproved } = req.body;

  if (typeof isApproved !== 'boolean') {
    return res.status(400).json({ message: 'isApproved must be a boolean' });
  }

  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    material.isApproved = isApproved;
    material.approvedBy = isApproved ? req.user.id : null;
    await material.save();

    res.json({ message: `Material ${isApproved ? 'approved' : 'rejected'}`, material });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get materials by course with pagination
// @route   GET /api/materials/course/:courseId?page=1&limit=10
exports.getMaterialsByCourse = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Material.countDocuments({ course: req.params.courseId, isApproved: true });
    const materials = await Material.find({ course: req.params.courseId, isApproved: true })
      .populate('uploader', 'firstName lastName')
      .populate('course', 'title courseCode')
      .skip(skip)
      .limit(limit);
    res.json({ materials, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get materials by user
// @route   GET /api/materials/user
exports.getUserMaterials = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Material.countDocuments({ uploader: req.user.id });
    const materials = await Material.find({ uploader: req.user.id })
      .populate('course', 'title courseCode')
      .skip(skip)
      .limit(limit);
    res.json({ materials, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get pending materials with pagination
// @route GET /api/materials/pending?page=1&limit=10
exports.getPendingMaterials = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Material.countDocuments({ isApproved: false });
    const materials = await Material.find({ isApproved: false })
      .populate('uploader', 'firstName lastName')
      .populate('course', 'title courseCode')
      .skip(skip)
      .limit(limit);

    res.json({ materials, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

