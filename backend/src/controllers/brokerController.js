const { mockBrokers } = require('../data/mockData');

class BrokerController {
    constructor() {
        this.brokers = [...mockBrokers];
    }

    getAllBrokers = (req, res) => {
        try {
            const { availability, specialty } = req.query;
            let filteredBrokers = [...this.brokers];

            if (availability) {
                filteredBrokers = filteredBrokers.filter(b => b.availability === availability);
            }
            if (specialty) {
                filteredBrokers = filteredBrokers.filter(b => 
                    b.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
                );
            }

            // Sort by rating (highest first)
            filteredBrokers.sort((a, b) => b.rating - a.rating);

            const response = {
                success: true,
                message: 'Brokers retrieved successfully',
                data: filteredBrokers
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving brokers'
            };
            res.status(500).json(response);
        }
    };

    getBrokerById = (req, res) => {
        try {
            const { id } = req.params;
            const broker = this.brokers.find(b => b.id === id);

            if (!broker) {
                const response = {
                    success: false,
                    message: 'Broker not found'
                };
                return res.status(404).json(response);
            }

            const response = {
                success: true,
                message: 'Broker retrieved successfully',
                data: broker
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving broker'
            };
            res.status(500).json(response);
        }
    };

    createBroker = (req, res) => {
        try {
            const brokerData = req.body;
            
            // Validate required fields
            if (!brokerData.name || !brokerData.email || !brokerData.phone) {
                const response = {
                    success: false,
                    message: 'Missing required fields: name, email, phone'
                };
                return res.status(400).json(response);
            }

            const newBroker = {
                ...brokerData,
                id: (this.brokers.length + 1).toString(),
                rating: brokerData.rating || 0,
                reviews: brokerData.reviews || 0,
                availability: brokerData.availability || 'available',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.brokers.push(newBroker);

            const response = {
                success: true,
                message: 'Broker created successfully',
                data: newBroker
            };

            res.status(201).json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error creating broker'
            };
            res.status(500).json(response);
        }
    };

    updateBroker = (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const brokerIndex = this.brokers.findIndex(b => b.id === id);
            
            if (brokerIndex === -1) {
                const response = {
                    success: false,
                    message: 'Broker not found'
                };
                return res.status(404).json(response);
            }

            this.brokers[brokerIndex] = {
                ...this.brokers[brokerIndex],
                ...updateData,
                id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };

            const response = {
                success: true,
                message: 'Broker updated successfully',
                data: this.brokers[brokerIndex]
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error updating broker'
            };
            res.status(500).json(response);
        }
    };

    deleteBroker = (req, res) => {
        try {
            const { id } = req.params;
            const brokerIndex = this.brokers.findIndex(b => b.id === id);
            
            if (brokerIndex === -1) {
                const response = {
                    success: false,
                    message: 'Broker not found'
                };
                return res.status(404).json(response);
            }

            this.brokers.splice(brokerIndex, 1);

            const response = {
                success: true,
                message: 'Broker deleted successfully'
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error deleting broker'
            };
            res.status(500).json(response);
        }
    };

    updateBrokerAvailability = (req, res) => {
        try {
            const { id } = req.params;
            const { availability } = req.body;
            
            if (!['available', 'busy', 'offline'].includes(availability)) {
                const response = {
                    success: false,
                    message: 'Invalid availability. Must be one of: available, busy, offline'
                };
                return res.status(400).json(response);
            }

            const brokerIndex = this.brokers.findIndex(b => b.id === id);
            
            if (brokerIndex === -1) {
                const response = {
                    success: false,
                    message: 'Broker not found'
                };
                return res.status(404).json(response);
            }

            this.brokers[brokerIndex].availability = availability;
            this.brokers[brokerIndex].updatedAt = new Date().toISOString();

            const response = {
                success: true,
                message: 'Broker availability updated successfully',
                data: this.brokers[brokerIndex]
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error updating broker availability'
            };
            res.status(500).json(response);
        }
    };
}

module.exports = { BrokerController };
