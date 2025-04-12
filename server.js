const app = require('./app');
const config = require('./config/config');
const sequelize = require('./config/database');

const PORT = config.port;

// Test Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // Start the server only after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${config.env} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.error(`Unhandled Rejection: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });

     // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            console.log('HTTP server closed');
            sequelize.close().then(() => {
                 console.log('Database connection closed');
                 process.exit(0);
            });
        });
    });


  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit if cannot connect to DB
  });
