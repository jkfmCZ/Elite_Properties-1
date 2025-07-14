const { mockProperties, mockBrokers, mockMarketInsights, mockQuickActions } = require('../data/mockData');

class ChatController {
    constructor() {
        this.chatHistory = [];
    }

    sendMessage = (req, res) => {
        try {
            const { content, type = 'text' } = req.body;
            
            if (!content) {
                const response = {
                    success: false,
                    message: 'Message content is required'
                };
                return res.status(400).json(response);
            }

            // Create user message
            const userMessage = {
                id: Date.now().toString(),
                content,
                sender: 'user',
                timestamp: new Date().toISOString(),
                type
            };

            this.chatHistory.push(userMessage);

            // Generate AI response based on content
            const aiResponse = this.generateAIResponse(content);
            this.chatHistory.push(aiResponse);

            const response = {
                success: true,
                message: 'Message sent successfully',
                data: aiResponse
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error sending message'
            };
            res.status(500).json(response);
        }
    };

    getChatHistory = (req, res) => {
        try {
            const { limit = 50, offset = 0 } = req.query;
            
            const paginatedHistory = this.chatHistory
                .slice(Number(offset), Number(offset) + Number(limit));

            const response = {
                success: true,
                message: 'Chat history retrieved successfully',
                data: paginatedHistory,
                meta: {
                    total: this.chatHistory.length,
                    limit: Number(limit),
                    page: Math.floor(Number(offset) / Number(limit)) + 1
                }
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving chat history'
            };
            res.status(500).json(response);
        }
    };

    clearChatHistory = (req, res) => {
        try {
            this.chatHistory = [];

            const response = {
                success: true,
                message: 'Chat history cleared successfully'
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error clearing chat history'
            };
            res.status(500).json(response);
        }
    };

    getQuickActions = (req, res) => {
        try {
            const response = {
                success: true,
                message: 'Quick actions retrieved successfully',
                data: mockQuickActions
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving quick actions'
            };
            res.status(500).json(response);
        }
    };

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Property-related responses
        if (lowerMessage.includes('property') || lowerMessage.includes('house') || lowerMessage.includes('apartment')) {
            return {
                id: (Date.now() + 1).toString(),
                content: "I'd be happy to help you find the perfect property! Here are some properties that might interest you:",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                type: 'property',
                embedData: {
                    properties: mockProperties.filter(p => p.status === 'available').slice(0, 3)
                }
            };
        }

        // Broker-related responses
        if (lowerMessage.includes('broker') || lowerMessage.includes('agent') || lowerMessage.includes('contact')) {
            return {
                id: (Date.now() + 1).toString(),
                content: "Here are our experienced real estate professionals who can assist you:",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                type: 'broker',
                embedData: {
                    brokers: mockBrokers.filter(b => b.availability === 'available')
                }
            };
        }

        // Market insight responses
        if (lowerMessage.includes('market') || lowerMessage.includes('trend') || lowerMessage.includes('price')) {
            return {
                id: (Date.now() + 1).toString(),
                content: "Here's the latest market analysis and trends:",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                type: 'market-insight',
                embedData: {
                    marketData: mockMarketInsights[0]
                }
            };
        }

        // Booking-related responses
        if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
            return {
                id: (Date.now() + 1).toString(),
                content: "I can help you schedule a property viewing! Please provide your details and preferred time.",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                type: 'booking'
            };
        }

        // Quick actions response
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return {
                id: (Date.now() + 1).toString(),
                content: "Here are some quick actions I can help you with:",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                type: 'quick-actions',
                embedData: {
                    actions: mockQuickActions
                }
            };
        }

        // Default response
        return {
            id: (Date.now() + 1).toString(),
            content: "Thank you for your message! I'm here to help you with all your real estate needs. I can assist you with finding properties, connecting with brokers, scheduling viewings, and providing market insights. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toISOString(),
            type: 'text'
        };
    }
}

module.exports = { ChatController };
