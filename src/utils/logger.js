const { createLogger, format, transports } = require('winston');
const path = require('path');

function initializeLogger() {
    const logFormat = format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    });

    const logger = createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.errors({ stack: true }),
            format.splat(),
            format.json(),
            logFormat
        ),
        transports: [
            // Log to console
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.printf(({ level, message, timestamp, stack }) => {
                        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
                    })
                ),
            }),

            // Log to a file (error logs)
            new transports.File({
                filename: path.join(__dirname, '../logs/error.log'),
                level: 'error',
            }),

            // Log to a file (all logs)
            new transports.File({
                filename: path.join(__dirname, '../logs/combined.log'),
            }),
        ],
        exceptionHandlers: [
            new transports.File({
                filename: path.join(__dirname, '../logs/exceptions.log'),
            }),
        ],
        rejectionHandlers: [
            new transports.File({
                filename: path.join(__dirname, '../logs/rejections.log'),
            }),
        ],
    });

    return logger;
}

// Initialize the logger instance
const logger = initializeLogger();

module.exports = {
    initializeLogger,
    logger,
};
