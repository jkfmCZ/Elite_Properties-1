const { Router } = require('express');
const { IndexController } = require('../controllers/indexController');
const { PropertyController } = require('../controllers/propertyController');
const { BookingController } = require('../controllers/bookingController');
const { BrokerController } = require('../controllers/brokerController');
const { MarketInsightController } = require('../controllers/marketInsightController');
const { ChatController } = require('../controllers/chatController');

const router = Router();

// Initialize controllers
const indexController = new IndexController();
const propertyController = new PropertyController();
const bookingController = new BookingController();
const brokerController = new BrokerController();
const marketInsightController = new MarketInsightController();
const chatController = new ChatController();

function setRoutes(app) {
    // Root routes
    app.use('/', router);
    router.get('/', indexController.getIndex.bind(indexController));
    router.get('/health', indexController.getHealth.bind(indexController));

    // API routes
    app.use('/api', createApiRoutes());
}

function createApiRoutes() {
    const apiRouter = Router();

    // Property routes
    apiRouter.get('/properties', propertyController.getAllProperties);
    apiRouter.get('/properties/featured', propertyController.getFeaturedProperties);
    apiRouter.get('/properties/:id', propertyController.getPropertyById);
    apiRouter.post('/properties', propertyController.createProperty);
    apiRouter.put('/properties/:id', propertyController.updateProperty);
    apiRouter.delete('/properties/:id', propertyController.deleteProperty);

    // Booking routes
    apiRouter.get('/bookings', bookingController.getAllBookings);
    apiRouter.get('/bookings/:id', bookingController.getBookingById);
    apiRouter.post('/bookings', bookingController.createBooking);
    apiRouter.put('/bookings/:id', bookingController.updateBooking);
    apiRouter.patch('/bookings/:id/status', bookingController.updateBookingStatus);
    apiRouter.delete('/bookings/:id', bookingController.deleteBooking);

    // Broker routes
    apiRouter.get('/brokers', brokerController.getAllBrokers);
    apiRouter.get('/brokers/:id', brokerController.getBrokerById);
    apiRouter.post('/brokers', brokerController.createBroker);
    apiRouter.put('/brokers/:id', brokerController.updateBroker);
    apiRouter.patch('/brokers/:id/availability', brokerController.updateBrokerAvailability);
    apiRouter.delete('/brokers/:id', brokerController.deleteBroker);

    // Market Insight routes
    apiRouter.get('/insights', marketInsightController.getAllInsights);
    apiRouter.get('/insights/latest', marketInsightController.getLatestInsights);
    apiRouter.get('/insights/:id', marketInsightController.getInsightById);
    apiRouter.post('/insights', marketInsightController.createInsight);
    apiRouter.put('/insights/:id', marketInsightController.updateInsight);
    apiRouter.delete('/insights/:id', marketInsightController.deleteInsight);

    // Chat routes
    apiRouter.post('/chat/message', chatController.sendMessage);
    apiRouter.get('/chat/history', chatController.getChatHistory);
    apiRouter.delete('/chat/history', chatController.clearChatHistory);
    apiRouter.get('/chat/actions', chatController.getQuickActions);

    return apiRouter;
}

module.exports = { setRoutes };
