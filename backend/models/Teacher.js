const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true, unique: true },
  rating: { type: String, required: true },
  comments: { type: String, default: null }, // Allow null values
  status: { type: String, required: true },
  language: { type: String, required: true },
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;
