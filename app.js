const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const apiRoutes = require('./routes'); // Main API router
const { errorHandler } = require('./middleware/errorMiddleware');
const db = require('./models'); // Import db object from models/index.js

const app = express();

// Security Middleware
app.use(helmet()); // Set various security headers
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max, // Limit each IP to max requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter); // Apply rate limiting to all API routes

// Body Parsing Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Database Sync (Optional - useful for development) ---
if (config.env === 'development') {
    db.syncDb(); // Sync database on startup in development
}
// --- End Database Sync ---


// API Routes
app.use('/api', apiRoutes); // Mount all API routes under /api

// Simple Root Route (Optional)
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});


// Central Error Handler Middleware (Should be last)
app.use(errorHandler);

module.exports = app;
