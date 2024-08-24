const express = require('express');
const router = express.Router();
const { getStudents, createStudent, updateStudent, deleteStudent } = require('../controllers/studentsController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getStudents);
router.post('/', authMiddleware, createStudent);
router.put('/', authMiddleware, updateStudent);
router.delete('/:id', authMiddleware, deleteStudent);

module.exports = router;
