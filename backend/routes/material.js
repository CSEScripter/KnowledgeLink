const express = require('express');
const router = express.Router();
const { uploadMaterial, approveMaterial, getMaterialsByCourse, getUserMaterials,getPendingMaterials } = require('../controllers/materialController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
// const { getPendingMaterials } = require('../controllers/materialController');


router.get('/pending', protect, restrictTo('Admin', 'Moderator', 'Teacher'), getPendingMaterials);

router.post('/', protect, uploadMaterial);
router.put('/:id/approve', protect, restrictTo('Admin', 'Moderator'), approveMaterial);
router.get('/course/:courseId', getMaterialsByCourse);
router.get('/user', protect, getUserMaterials);

module.exports = router;