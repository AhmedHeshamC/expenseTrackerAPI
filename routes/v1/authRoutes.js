const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../../controllers/authController');
const { handleValidationErrors } = require('../../middleware/validationMiddleware');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('username').isAlphanumeric().withMessage('Username must be alphanumeric').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  handleValidationErrors, // Middleware to handle validation results
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

module.exports = router;
