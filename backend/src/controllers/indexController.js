class IndexController {
    getIndex(req, res) {
        const response = {
            success: true,
            message: 'Elite Properties API is running',
            data: {
                name: 'Elite Properties Backend API',
                version: '1.0.0',
                description: 'Real Estate Management System API',
                endpoints: {
                    properties: '/api/properties',
                    bookings: '/api/bookings',
                    brokers: '/api/brokers',
                    insights: '/api/insights',
                    chat: '/api/chat',
                    actions: '/api/actions'
                }
            }
        };
        
        res.json(response);
    }

    getHealth(req, res) {
        const response = {
            success: true,
            message: 'API is healthy',
            data: {
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                environment: process.env.NODE_ENV || 'development'
            }
        };
        
        res.json(response);
    }
}

module.exports = { IndexController };
