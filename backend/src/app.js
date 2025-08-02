const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { setRoutes } = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;
const GO_PORT = process.env.GO_PORT || '8080';

let goProcess = null;

// Function to check if Go is installed
function checkGoInstallation() {
    return new Promise((resolve) => {
        const goCheck = spawn('go', ['version'], { stdio: 'pipe' });
        
        goCheck.on('close', (code) => {
            resolve(code === 0);
        });
        
        goCheck.on('error', () => {
            resolve(false);
        });
    });
}

// Function to start Go backend
async function startGoBackend() {
    try {
        // Check if Go is installed
        const goInstalled = await checkGoInstallation();
        if (!goInstalled) {
            console.log('⚠️  Go is not installed or not in PATH. Skipping Go backend startup.');
            console.log('💡 Install Go from https://golang.org/dl/ to enable full functionality.');
            return;
        }

        // Check if go directory exists (it's in src/go, not ../go)
        const goDir = path.join(__dirname, 'go');
        if (!fs.existsSync(goDir)) {
            console.log('⚠️  Go directory not found. Skipping Go backend startup.');
            console.log(`🔍 Looked for Go directory at: ${goDir}`);
            return;
        }

        // Check if main.go exists
        const mainGoPath = path.join(goDir, 'main.go');
        if (!fs.existsSync(mainGoPath)) {
            console.log('⚠️  main.go not found in go directory. Skipping Go backend startup.');
            return;
        }

        console.log('🚀 Starting Go backend...');
        
        // Spawn Go process with better error handling
        goProcess = spawn('go', ['run', 'main.go'], {
            cwd: goDir,
            env: {
                ...process.env,
                PORT: GO_PORT
            },
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Handle Go process output
        goProcess.stdout.on('data', (data) => {
            console.log(`[Go Backend] ${data.toString().trim()}`);
        });

        goProcess.stderr.on('data', (data) => {
            console.error(`[Go Backend Error] ${data.toString().trim()}`);
        });

        goProcess.on('exit', (code, signal) => {
            if (signal) {
                console.log(`🛑 Go backend killed with signal ${signal}`);
            } else {
                console.log(`🛑 Go backend exited with code ${code}`);
            }
            goProcess = null;
        });

        goProcess.on('error', (error) => {
            console.error('❌ Failed to start Go backend:', error.message);
            goProcess = null;
        });

        // Give Go backend time to start
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`🚦 Go backend should be running on port ${GO_PORT}`);

    } catch (error) {
        console.error('❌ Error starting Go backend:', error.message);
    }
}

// Graceful shutdown
function gracefulShutdown() {
    console.log('\n🛑 Caught interrupt signal. Shutting down gracefully...');
    
    if (goProcess) {
        console.log('🔄 Terminating Go backend...');
        goProcess.kill('SIGTERM');
        
        // Force kill if it doesn't exit gracefully
        setTimeout(() => {
            if (goProcess) {
                console.log('🔪 Force killing Go backend...');
                goProcess.kill('SIGKILL');
            }
        }, 5000);
    }
    
    setTimeout(() => {
        process.exit(0);
    }, 6000);
}

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGQUIT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true'
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        node_backend: 'running',
        go_backend: goProcess ? 'running' : 'not running'
    });
});

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
        
        // Start Node.js server
        const server = app.listen(PORT, () => {
            console.log(`🚀 Elite Properties Backend Server running on port ${PORT}`);
            console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
            console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
            console.log(`🗄️  Database: ${process.env.DB_NAME || 'elite_properties'}`);
            console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Start Go backend after Node.js server is running
        await startGoBackend();

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
            } else {
                console.error('❌ Server error:', error);
            }
            gracefulShutdown();
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the application
startServer();

module.exports = app;