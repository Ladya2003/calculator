const express = require('express');
const router = express.Router();
const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teachersController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getTeachers);
router.post('/', authMiddleware, createTeacher);
router.put('/', authMiddleware, updateTeacher);
router.delete('/:id', authMiddleware, deleteTeacher);

module.exports = router;
