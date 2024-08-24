const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRole = require('../constants/user');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
  const { login, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = await User.findOne({ login });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ _id: new mongoose.Types.ObjectId(), login, password });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id, role: user.role, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.protection = async (req, res) => {
  if (req.user.role !== UserRole.Admin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json({ role: UserRole.Admin });
};

exports.getUser = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = (req, res) => {
  res.json({ token: null, message: 'Logged out successfully' });
};

exports.updateUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login && !password) {
      return res.status(400).json({ message: 'Please provide a new login or password' });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (login) {
      user.login = login;
    }
    if (password) {
      user.password = password;
    }

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
