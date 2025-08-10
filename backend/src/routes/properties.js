const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { BrokerController } = require('../controllers/brokerController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Create an instance of BrokerController
const brokerController = new BrokerController();

// Public routes
router.get('/', optionalAuth, propertyController.getAllProperties);
router.get('/brokers', brokerController.getAllBrokers);
router.get('/:id', optionalAuth, propertyController.getPropertyById);

// Protected routes (broker only)
router.post('/', authenticateToken, propertyController.createProperty);
router.put('/:id', authenticateToken, propertyController.updateProperty);
router.delete('/:id', authenticateToken, propertyController.deleteProperty);

// Broker dashboard routes
router.get('/dashboard/my-properties', authenticateToken, propertyController.getMyProperties);

module.exports = router;
