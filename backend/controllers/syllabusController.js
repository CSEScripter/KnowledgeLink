const Syllabus = require('../models/Syllabus');
const multer = require('multer');
const path = require('path');

// Multer setup for syllabus uploads
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
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: PDF files only!');
  },
});

// @desc    Upload a syllabus
// @route   POST /api/syllabus
exports.uploadSyllabus = [
  upload.single('file'),
  async (req, res) => {
    const { session } = req.body;

    if (!session || !req.file) {
      return res.status(400).json({ message: 'Session and file are required' });
    }

    try {
      const syllabus = await Syllabus.create({
        session,
        filePath: req.file.path,
        uploadedBy: req.user.id,
      });

      res.status(201).json(syllabus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// @desc    Get syllabi by session
// @route   GET /api/syllabus/:session
exports.getSyllabusBySession = async (req, res) => {
  try {
    const syllabi = await Syllabus.find({ session: req.params.session })
      .populate('uploadedBy', 'firstName lastName');
    res.json(syllabi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};