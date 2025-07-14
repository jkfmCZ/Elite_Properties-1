const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { setRoutes } = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true'
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
setRoutes(app);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();
        
        app.listen(PORT, () => {
            console.log(`🚀 Elite Properties Backend Server running on port ${PORT}`);
            console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
            console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
            console.log(`🗄️  Database: ${process.env.DB_NAME || 'elite_properties'}`);
            console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;