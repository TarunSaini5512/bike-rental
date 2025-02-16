const express = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

class IndexRoute {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.use('/auth/', authRoutes)
        this.router.use('/', userRoutes)
    }
}

module.exports = { IndexRoute };
