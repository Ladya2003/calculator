const Teacher = require('../models/Teacher');
const mongoose = require('mongoose');

exports.getTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.json({ teachers });
};

exports.createTeacher = async (req, res) => {
  const { name, rating, comments, status, language } = req.body;
  const teacher = new Teacher({ _id: new mongoose.Types.ObjectId(), name, rating, comments, status, language });
  await teacher.save();
  res.json({ teacher });
};

exports.updateTeacher = async (req, res) => {
  const { _id, name, rating, comments, status, language } = req.body;
  const teacher = await Teacher.findById(_id);
  if (!teacher) {
    return res.status(404).send({ message: 'Teacher not found' });
  }
  teacher.name = name;
  teacher.rating = rating;
  teacher.comments = comments;
  teacher.status = status;
  teacher.language = language;
  await teacher.save();
  res.send(teacher);
};

exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;
  const teacherId = new mongoose.Types.ObjectId(id);
  await Teacher.findByIdAndDelete(teacherId);
  res.send({ message: 'Teacher deleted successfully' });
}
