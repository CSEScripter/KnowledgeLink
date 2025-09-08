const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer setup for profile picture
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
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Images only!');
  },
});

// @desc    Edit user profile
// @route   PUT /api/users/profile
exports.editProfile = [
  upload.single('profilePicture'),
  async (req, res) => {
    const {
      firstName,
      lastName,
      bio,
      fatherName,
      motherName,
      phoneNumber,
      bloodGroup,
      session,
      semester,
      socialLinks,
    } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.bio = bio || user.bio;
      user.fatherName = fatherName || user.fatherName;
      user.motherName = motherName || user.motherName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.bloodGroup = bloodGroup || user.bloodGroup;
      user.session = session || user.session;
      user.semester = semester || user.semester;
      user.socialLinks = socialLinks ? JSON.parse(socialLinks) : user.socialLinks;
      if (req.file) user.profilePicture = req.file.path;

      await user.save();

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio,
        fatherName: user.fatherName,
        motherName: user.motherName,
        phoneNumber: user.phoneNumber,
        bloodGroup: user.bloodGroup,
        session: user.session,
        semester: user.semester,
        socialLinks: user.socialLinks,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// @desc    Assign role to user (Admin only)
// @route   PUT /api/users/:id/role
exports.assignRole = async (req, res) => {
  const { role } = req.body;
  const validRoles = ['Student', 'Teacher', 'Admin', 'Moderator'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ message: 'Valid role is required' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};