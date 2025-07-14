const { mockMarketInsights } = require('../data/mockData');

class MarketInsightController {
    constructor() {
        this.insights = [...mockMarketInsights];
    }

    getAllInsights = (req, res) => {
        try {
            const { trend, timeframe } = req.query;
            let filteredInsights = [...this.insights];

            if (trend) {
                filteredInsights = filteredInsights.filter(i => i.trend === trend);
            }
            if (timeframe) {
                filteredInsights = filteredInsights.filter(i => 
                    i.timeframe.toLowerCase().includes(timeframe.toLowerCase())
                );
            }

            // Sort by creation date (newest first)
            filteredInsights.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const response = {
                success: true,
                message: 'Market insights retrieved successfully',
                data: filteredInsights
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving market insights'
            };
            res.status(500).json(response);
        }
    };

    getInsightById = (req, res) => {
        try {
            const { id } = req.params;
            const insight = this.insights.find(i => i.id === id);

            if (!insight) {
                const response = {
                    success: false,
                    message: 'Market insight not found'
                };
                return res.status(404).json(response);
            }

            const response = {
                success: true,
                message: 'Market insight retrieved successfully',
                data: insight
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving market insight'
            };
            res.status(500).json(response);
        }
    };

    createInsight = (req, res) => {
        try {
            const insightData = req.body;
            
            // Validate required fields
            if (!insightData.title || !insightData.trend || !insightData.description) {
                const response = {
                    success: false,
                    message: 'Missing required fields: title, trend, description'
                };
                return res.status(400).json(response);
            }

            const newInsight = {
                ...insightData,
                id: (this.insights.length + 1).toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.insights.push(newInsight);

            const response = {
                success: true,
                message: 'Market insight created successfully',
                data: newInsight
            };

            res.status(201).json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error creating market insight'
            };
            res.status(500).json(response);
        }
    };

    updateInsight = (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const insightIndex = this.insights.findIndex(i => i.id === id);
            
            if (insightIndex === -1) {
                const response = {
                    success: false,
                    message: 'Market insight not found'
                };
                return res.status(404).json(response);
            }

            this.insights[insightIndex] = {
                ...this.insights[insightIndex],
                ...updateData,
                id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };

            const response = {
                success: true,
                message: 'Market insight updated successfully',
                data: this.insights[insightIndex]
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error updating market insight'
            };
            res.status(500).json(response);
        }
    };

    deleteInsight = (req, res) => {
        try {
            const { id } = req.params;
            const insightIndex = this.insights.findIndex(i => i.id === id);
            
            if (insightIndex === -1) {
                const response = {
                    success: false,
                    message: 'Market insight not found'
                };
                return res.status(404).json(response);
            }

            this.insights.splice(insightIndex, 1);

            const response = {
                success: true,
                message: 'Market insight deleted successfully'
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error deleting market insight'
            };
            res.status(500).json(response);
        }
    };

    getLatestInsights = (req, res) => {
        try {
            const limit = Number(req.query.limit) || 5;
            
            // Get the most recent insights
            const latestInsights = this.insights
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, limit);

            const response = {
                success: true,
                message: 'Latest market insights retrieved successfully',
                data: latestInsights
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving latest market insights'
            };
            res.status(500).json(response);
        }
    };
}

module.exports = { MarketInsightController };
