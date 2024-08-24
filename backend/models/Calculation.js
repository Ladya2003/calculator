const mongoose = require('mongoose');

const CalculationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  currency: { type: String, required: true },
  teacherName: { type: String, required: true },
  studentName: { type: String, required: true },
  lessons: { type: Number, required: true },
  lessonCost: { type: Number, required: true },
  taxPercentage: { type: Number, required: true },
  teachersCostFor90Mins: { type: Number, required: true },
  teachersMinutes: { type: Number, required: true },
  firmPercentage: { type: Number, required: true },
  comments: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Calculation = mongoose.model('Calculation', CalculationSchema);
module.exports = Calculation;
