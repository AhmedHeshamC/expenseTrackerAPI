const express = require('express');
const v1Routes = require('./v1');

const router = express.Router();

// Mount v1 routes
router.use('/v1', v1Routes);

// Add more versions here in the future e.g. router.use('/v2', v2Routes);

// Default route for /api if needed
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Expense Tracker API. Please use /api/v1' });
});

module.exports = router;
