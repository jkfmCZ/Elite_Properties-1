const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        message: err.message || 'Internal Server Error',
        status: err.statusCode || 500
    };

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, status: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, status: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, status: 400 };
    }

    // MySQL errors
    if (err.code) {
        switch (err.code) {
            case 'ER_DUP_ENTRY':
                error = { message: 'Duplicate entry found', status: 400 };
                break;
            case 'ER_NO_SUCH_TABLE':
                error = { message: 'Database table not found', status: 500 };
                break;
            case 'ER_BAD_FIELD_ERROR':
                error = { message: 'Invalid database field', status: 400 };
                break;
            case 'ECONNREFUSED':
                error = { message: 'Database connection refused', status: 503 };
                break;
            default:
                if (err.sqlMessage) {
                    error = { message: 'Database error occurred', status: 500 };
                }
        }
    }

    res.status(error.status).json({
        success: false,
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
