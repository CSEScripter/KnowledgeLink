const mongoose = require('mongoose');
const syllabusSchema = new mongoose.Schema({
  session: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Syllabus', syllabusSchema);