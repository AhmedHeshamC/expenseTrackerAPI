const { Expense } = require('../models');
const { getFilterOptions } = require('../services/expenseService');
const { Op } = require('sequelize');

// @desc    Create new expense
// @route   POST /api/v1/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  const { description, amount, category, date } = req.body;
  const userId = req.user.id; // Get user ID from authenticated user

  try {
    const expense = await Expense.create({
      description,
      amount,
      category,
      date,
      userId,
    });
    res.status(201).json(expense);
  } catch (error) {
     if (error.name === 'SequelizeValidationError') {
        res.status(400); // Bad request for validation errors
     }
    next(error);
  }
};

// @desc    Get user expenses with filtering
// @route   GET /api/v1/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  const userId = req.user.id;
  const { filter, startDate, endDate, category, minAmount, maxAmount, description } = req.query; // Add more query params

  try {
    let whereClause = { userId };

    // Date Filtering
    const dateFilterOptions = getFilterOptions(filter, startDate, endDate);
    if (dateFilterOptions.date) {
        whereClause.date = dateFilterOptions.date;
    }

    // Category Filtering
    if (category) {
        // Allow multiple categories separated by comma
        const categories = category.split(',').map(cat => cat.trim());
        whereClause.category = { [Op.in]: categories };
    }

    // Amount Filtering
    if (minAmount || maxAmount) {
        whereClause.amount = {};
        if (minAmount) {
            whereClause.amount[Op.gte] = parseFloat(minAmount);
        }
        if (maxAmount) {
            whereClause.amount[Op.lte] = parseFloat(maxAmount);
        }
         // Validate amounts
        if (isNaN(whereClause.amount[Op.gte]) && isNaN(whereClause.amount[Op.lte])) {
            delete whereClause.amount; // Remove invalid amount filter
            console.warn("Invalid amount filter provided.");
        } else if (isNaN(whereClause.amount[Op.gte])) {
             delete whereClause.amount[Op.gte];
        } else if (isNaN(whereClause.amount[Op.lte])) {
             delete whereClause.amount[Op.lte];
        }
    }

     // Description Filtering (Case-insensitive search)
    if (description) {
        // Use Op.like for MySQL compatibility. Case-insensitivity depends on collation.
        whereClause.description = { [Op.like]: `%${description}%` };
    }


    const expenses = await Expense.findAll({
      where: whereClause,
      order: [['date', 'DESC']], // Default order by date descending
    });

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense by ID
// @route   GET /api/v1/expenses/:id
// @access  Private
const getExpenseById = async (req, res, next) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: userId },
    });

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/v1/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  const userId = req.user.id;
  const expenseId = req.params.id;
  const { description, amount, category, date } = req.body;

  try {
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: userId },
    });

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Update fields if they are provided in the request body
    expense.description = description ?? expense.description;
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;

    await expense.save(); // This will trigger validation hooks if any
    res.json(expense);
  } catch (error) {
     if (error.name === 'SequelizeValidationError') {
        res.status(400);
     }
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/v1/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  const userId = req.user.id;
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: userId },
    });

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    await expense.destroy();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
