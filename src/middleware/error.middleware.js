function errorMiddleware(error, req, res, next) {
    try {
        var status = error.status || 500;
        var message = error.message || 'Something went wrong';

        console.error('[' + req.method + '] ' + req.path + ' >> StatusCode:: ' + status + ', Message:: ' + message);
        res.status(status).json({ message: message });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = { errorMiddleware };
