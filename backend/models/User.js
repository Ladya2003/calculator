const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserRole = require('../constants/user');

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  login: { type: String, unique: true },
  password: String,
  role: { type: String, enum: [UserRole.Admin, UserRole.Guest], default: UserRole.Guest },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
