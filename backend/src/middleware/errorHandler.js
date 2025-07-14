const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const authenticate = (req, res, next) => {
    // Placeholder for authentication logic
    next();
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    res.json({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
};

module.exports = {
    logger,
    authenticate,
    notFound,
    errorHandler
};
