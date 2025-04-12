const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: config.env === 'development' ? console.log : false, // Log SQL in dev
  }
);

module.exports = sequelize;
