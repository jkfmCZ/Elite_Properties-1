const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, propertyController.getAllProperties);
router.get('/:id', optionalAuth, propertyController.getPropertyById);

// Protected routes (broker only)
router.post('/', authenticateToken, propertyController.createProperty);
router.put('/:id', authenticateToken, propertyController.updateProperty);
router.delete('/:id', authenticateToken, propertyController.deleteProperty);

// Broker dashboard routes
router.get('/dashboard/my-properties', authenticateToken, propertyController.getMyProperties);

module.exports = router;
