const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Expense extends Model {}

Expense.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null or provide default if needed
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Example: Up to 10 digits, 2 decimal places
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0.01, // Ensure positive amount
    },
  },
  category: {
    type: DataTypes.ENUM(
      'Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others'
    ),
    allowNull: false,
    validate: {
      isIn: [['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others']],
    },
  },
  date: {
    type: DataTypes.DATEONLY, // Store only the date part
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // This should match the table name Sequelize creates for User
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Expense',
  timestamps: true,
});

module.exports = Expense;
