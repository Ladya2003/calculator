const express = require('express');
const router = express.Router();
const { getCalculations, createCalculation, updateCalculation, deleteCalculation } = require('../controllers/calculationsController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getCalculations);
router.post('/', authMiddleware, createCalculation);
router.put('/', authMiddleware, updateCalculation);
router.delete('/:id', authMiddleware, deleteCalculation);

module.exports = router;
