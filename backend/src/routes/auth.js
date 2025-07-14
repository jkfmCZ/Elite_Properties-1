const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Authentication routes
router.post('/login', authController.login);
router.post('/register', authenticateToken, requireAdmin, authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

// Profile routes
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
