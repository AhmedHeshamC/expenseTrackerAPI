const sequelize = require('../config/database');
const User = require('./User');
const Expense = require('./Expense');

// Define associations
User.hasMany(Expense, { foreignKey: 'userId', onDelete: 'CASCADE' }); // If user deleted, delete their expenses
Expense.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  Expense,
};

// Function to sync database (optional, useful for development)
db.syncDb = async () => {
  try {
    // Use { force: true } only in development to drop and recreate tables
    // Use { alter: true } in development to update tables based on models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
    process.exit(1); // Exit if DB sync fails
  }
};

module.exports = db;
