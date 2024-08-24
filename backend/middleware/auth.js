const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Токен не прадастаўлены' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Карыстальнік не знойдзены' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Няправільны токен' });
  }
};

module.exports = authMiddleware;
