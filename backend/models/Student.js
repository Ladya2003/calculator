const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true, unique: true },
  rating: { type: String, required: true },
  comments: { type: String, default: null },
  status: { type: String, required: true },
  language: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
