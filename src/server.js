const { createApp } = require('./app');
const { disconnectDB } = require('./config/Database');

const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];


process.on('unhandledRejection', function (reason, promise) {
  console.error('App exiting due to an unhandled promise rejection: ' + promise + ' and reason: ' + reason);
  // Throw the error to let the uncaughtException handler handle it
  throw reason;
});

process.on('uncaughtException', function (error) {
  console.error('App exiting due to an uncaught exception: ' + error);
  process.exit(1);
});

(async () => {
  try {
    const { initialize, start } = createApp();
    const port = process.env.PORT || 3000;
    const env = process.env.NODE_ENV || 'development';

    await initialize();
    const server = start(port, env);
    exitSignals.forEach(function (exitSignal) {
      process.on(exitSignal, async () => {
        try {
          await disconnectDB();
          server.close(() => {
            console.info('Server stopped successfully.');
            process.exit(0);
          });
        } catch (error) {
          console.error('Error during disconnection: ' + error);
          process.exit(1);
        }
      });
    });
  } catch (error) {
    console.error('App exited with error: ' + error);
    disconnectDB();
  }
})();