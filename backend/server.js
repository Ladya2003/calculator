// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://admin:H4_H6WtcYm!k_-c@cluster0.devd2pu.mongodb.net/calculator', { useNewUrlParser: true, useUnifiedTopology: true });

const CalculationSchema = new mongoose.Schema({
  total: Number,
  lawyer: Number,
  teacher: Number,
  accountant: Number
});

const Calculation = mongoose.model('Calculation', CalculationSchema);

app.post('/save', async (req, res) => {
  const { total, lawyer, teacher, accountant } = req.body;
  const calculation = new Calculation({ total, lawyer, teacher, accountant });
  await calculation.save();
  res.send({ message: 'Calculation saved successfully!' });
});

app.get('/calculations', async (req, res) => {
  const calculations = await Calculation.find();
  res.send(calculations);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});