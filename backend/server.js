require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Import routes
const calculationsRoutes = require('./routes/calculations');
const teachersRoutes = require('./routes/teachers');
const studentsRoutes = require('./routes/students');
const usersRoutes = require('./routes/users');

// Use routes
app.use('/api/calculations', calculationsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
