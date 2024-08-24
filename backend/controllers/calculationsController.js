const Calculation = require('../models/Calculation');
const mongoose = require('mongoose');

// Get all calculations
exports.getCalculations = async (req, res) => {
  const calculations = await Calculation.find().sort({ createdAt: -1 });
  res.json({ calculations });
};

// Create a new calculation
exports.createCalculation = async (req, res) => {
  const { currency, teacherName, studentName, lessons, lessonCost, taxPercentage, teachersCostFor90Mins, teachersMinutes, firmPercentage, comments } = req.body;
  const calculation = new Calculation({
    _id: new mongoose.Types.ObjectId(),
    currency,
    teacherName,
    studentName,
    lessons,
    lessonCost,
    taxPercentage,
    teachersCostFor90Mins,
    teachersMinutes,
    firmPercentage,
    comments
  });
  await calculation.save();
  res.json({ calculation, message: 'Calculation saved successfully!' });
};

// Update an existing calculation
exports.updateCalculation = async (req, res) => {
  const { _id, currency, teacherName, studentName, lessons, lessonCost, taxPercentage, teachersCostFor90Mins, teachersMinutes, firmPercentage, comments } = req.body;
  const calculation = await Calculation.findById(_id);
  if (!calculation) {
    return res.status(404).send({ message: 'Calculation not found' });
  }
  calculation.currency = currency;
  calculation.teacherName = teacherName;
  calculation.studentName = studentName;
  calculation.lessons = lessons;
  calculation.lessonCost = lessonCost;
  calculation.taxPercentage = taxPercentage;
  calculation.teachersCostFor90Mins = teachersCostFor90Mins;
  calculation.teachersMinutes = teachersMinutes;
  calculation.firmPercentage = firmPercentage;
  calculation.comments = comments;
  await calculation.save();
  res.send({ calculation, message: 'Calculation updated successfully!' });
};

// Delete a calculation
exports.deleteCalculation = async (req, res) => {
  const { id } = req.params;
  const calculationId = new mongoose.Types.ObjectId(id);
  await Calculation.findByIdAndDelete(calculationId);
  res.send({ message: 'Calculation deleted successfully' });
}
