const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Test route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes are working',
        endpoints: [
            'POST /api/auth/login',
            'POST /api/auth/register', 
            'POST /api/auth/refresh-token',
            'POST /api/auth/logout',
            'GET /api/auth/profile'
        ]
    });
});

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authenticateToken, requireAdmin, authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

// Profile routes
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
