const express = require('express');
const authRoutes = require('./authRoutes');
const expenseRoutes = require('./expenseRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);

// Simple health check for v1
router.get('/health', (req, res) => res.status(200).json({ status: 'OK', version: 'v1' }));


module.exports = router;
