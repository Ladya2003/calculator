const Student = require('../models/Student');
const mongoose = require('mongoose');

exports.getStudents = async (req, res) => {
  const students = await Student.find();
  res.json({ students });
};

exports.createStudent = async (req, res) => {
  const { name, rating, comments, status, language } = req.body;
  const student = new Student({ _id: new mongoose.Types.ObjectId(), name, rating, comments, status, language });
  await student.save();
  res.json({ student });
};

exports.updateStudent = async (req, res) => {
  const { _id, name, rating, comments, status, language } = req.body;
  const student = await Student.findById(_id);
  if (!student) {
    return res.status(404).send({ message: 'Студэнт не знойдзены' });
  }
  student.name = name;
  student.rating = rating;
  student.comments = comments;
  student.status = status;
  student.language = language;
  await student.save();
  res.send(student);
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  const studentId = new mongoose.Types.ObjectId(id);
  await Student.findByIdAndDelete(studentId);
  res.send({ message: 'Студэнт паспяхова выдалены' });
}
