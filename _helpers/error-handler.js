const logger = require('./logger');

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string' || err.code) {
        // custom application error
        return res.status(400).json({ message: err.message, code: err.code });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        logger.error({ message: err.message })
        return res.status(400).json({ message: err.message, code: 1001 });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token', code: 1002 });
    }

    // default to 500 server error
    logger.error({ message: err.message })
    return res.status(500).json({ message: err.message, code: err.code });
}
