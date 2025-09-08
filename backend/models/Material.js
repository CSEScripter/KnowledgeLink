const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true }, // Path to file in uploads/
  fileType: { type: String, required: true }, // e.g., pdf, docx, mp4
  category: {
    type: String,
    enum: ['Syllabus', 'Presentation', 'Question', 'Notes', 'Other'],
    required: true,
  },
  isApproved: { type: Boolean, default: false }, // Needs approval for Students
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Moderator/Admin
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Material', materialSchema);