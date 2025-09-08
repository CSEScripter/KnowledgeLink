const express = require('express');
const router = express.Router();
const { editProfile, assignRole, getUsers } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUsers);  // GET /profile যুক্ত করলাম
router.put('/profile', protect, editProfile);
router.put('/:id/role', protect, restrictTo('Admin'), assignRole);
router.get('/', protect, restrictTo('Admin'), getUsers);

module.exports = router;