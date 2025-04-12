const express = require('express');
const { body, query, param } = require('express-validator');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../../controllers/expenseController');
const { protect } = require('../../middleware/authMiddleware');
const { handleValidationErrors } = require('../../middleware/validationMiddleware');

const router = express.Router();

// Apply protect middleware to all expense routes
router.use(protect);

// Validation rules
const expenseIdValidation = [
    param('id').isInt({ gt: 0 }).withMessage('Expense ID must be a positive integer'),
    handleValidationErrors,
];

const createExpenseValidation = [
    body('amount').isDecimal({ decimal_digits: '1,2' }).withMessage('Amount must be a valid decimal').toFloat().isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    body('category').isIn(['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others']).withMessage('Invalid category'),
    body('date').isISO8601().toDate().withMessage('Date must be a valid date in YYYY-MM-DD format'),
    body('description').optional().isString().trim().escape(), // Sanitize description
    handleValidationErrors,
];

const updateExpenseValidation = [
    param('id').isInt({ gt: 0 }).withMessage('Expense ID must be a positive integer'),
    // Make update fields optional, but validate if present
    body('amount').optional().isDecimal({ decimal_digits: '1,2' }).withMessage('Amount must be a valid decimal').toFloat().isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    body('category').optional().isIn(['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others']).withMessage('Invalid category'),
    body('date').optional().isISO8601().toDate().withMessage('Date must be a valid date in YYYY-MM-DD format'),
    body('description').optional().isString().trim().escape(),
    handleValidationErrors,
];

const getExpensesValidation = [
    query('filter').optional().isIn(['week', 'month', '3months']).withMessage('Invalid filter value'),
    query('startDate').optional().isISO8601().withMessage('Start date must be YYYY-MM-DD'),
    query('endDate').optional().isISO8601().withMessage('End date must be YYYY-MM-DD'),
    query('category').optional().isString().trim().escape(),
    query('minAmount').optional().isFloat({ gt: 0 }).withMessage('Min amount must be a positive number'),
    query('maxAmount').optional().isFloat({ gt: 0 }).withMessage('Max amount must be a positive number'),
    query('description').optional().isString().trim().escape(),
    // Custom validation to ensure if one date is provided, the other is too (for custom range)
    query().custom((value, { req }) => {
        if ((req.query.startDate && !req.query.endDate) || (!req.query.startDate && req.query.endDate)) {
            throw new Error('Both startDate and endDate are required for custom date range');
        }
        if (req.query.startDate && req.query.endDate && new Date(req.query.startDate) > new Date(req.query.endDate)) {
             throw new Error('startDate cannot be after endDate');
        }
        if (req.query.minAmount && req.query.maxAmount && parseFloat(req.query.minAmount) > parseFloat(req.query.maxAmount)) {
             throw new Error('minAmount cannot be greater than maxAmount');
        }
        return true;
    }),
    handleValidationErrors,
];


// Define routes
router.route('/')
    .post(createExpenseValidation, createExpense)
    .get(getExpensesValidation, getExpenses);

router.route('/:id')
    .get(expenseIdValidation, getExpenseById)
    .put(updateExpenseValidation, updateExpense)
    .delete(expenseIdValidation, deleteExpense);

module.exports = router;
