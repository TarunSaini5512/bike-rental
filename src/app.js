const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { IndexRoute } = require('./routes/index');
const { connectDB } = require('./config/Database');
const { errorMiddleware } = require('./middleware/error.middleware');
const { RESPONSE_FAILURE, RESPONSE_CODE } = require('./config/Constants');
const { sendResponse } = require('./utils/common');
const { logger } = require('./utils/logger');

function createApp() {
    const app = express();

    function setupMiddlewares() {
        app.use(cors({ origin: '*' }));
        app.use(bodyParser.json({ limit: '2mb' }));
        app.use(express.urlencoded({ limit: '3mb', extended: true }));
        app.use('/public', express.static(path.join(__dirname, '..', 'public')));

        app.use((req, res, next) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
            res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            if (req.method === 'OPTIONS') return res.status(200).send();
            next();
        });
    }


    
    
    
    function setupRoutes() {
        const routes = new IndexRoute();
        app.use('/', routes.router);

        app.use((err, req, res, next) => {
            if (err.name === 'UnauthorizedError') {
                console.error('Invalid token...');
                return sendResponse(res, {}, 'USER_UNAUTHENTICATED', RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORISED);
            }
            next();
        });
    }

    app.use('/public', express.static(path.join(__dirname, 'public')));

    function setupErrorHandling() {
        app.use(errorMiddleware);
    }

    async function initialize() {
        await connectDB();
        setupMiddlewares();
        setupRoutes();
        setupErrorHandling();
    }

    function start(port, env) {
        return app.listen(port, () => {
            logger.info('==========================================');
            logger.info(`🚀 API (${env}) is running on port ${port}`);
            logger.info('==========================================');
        });
    }

    return {
        initialize,
        start,
        getApp: () => app,
    };
}

module.exports = { createApp };
