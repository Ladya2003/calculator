const express = require('express');
const router = express.Router();
const { register, login, logout, protection, updateUser, getUser } = require('../controllers/usersController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout',logout);
router.post('/protection', authMiddleware, protection);
router.put('/', authMiddleware, updateUser);
router.get('/', authMiddleware, getUser);

module.exports = router;
