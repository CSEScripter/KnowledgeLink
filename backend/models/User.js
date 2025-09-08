const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Teacher', 'Moderator', 'Admin'], default: 'Student' },
  bio: { type: String },
  fatherName: { type: String },
  motherName: { type: String },
  phoneNumber: { type: String },
  bloodGroup: { type: String },
  session: { type: String },
  semester: { type: String },
  socialLinks: { type: Object },
});

module.exports = mongoose.model('User', userSchema);