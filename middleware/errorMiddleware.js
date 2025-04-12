const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error("Error:", err.message); // Log the error message
  if (config.env === 'development') {
      console.error(err.stack); // Log stack trace in development
  }

  res.json({
    message: err.message,
    // Provide stack trace only in development environment for security reasons
    stack: config.env === 'development' ? err.stack : null,
  });
};

module.exports = { errorHandler };
