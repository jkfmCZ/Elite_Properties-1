const { mockProperties, mockBrokers, mockMarketInsights, mockQuickActions } = require('../data/mockData');

class PropertyController {
    constructor() {
        this.properties = [...mockProperties];
    }

    getAllProperties = (req, res) => {
        try {
            const filters = req.query;
            let filteredProperties = [...this.properties];

            // Apply filters
            if (filters.type) {
                filteredProperties = filteredProperties.filter(p => p.type === filters.type);
            }
            if (filters.status) {
                filteredProperties = filteredProperties.filter(p => p.status === filters.status);
            }
            if (filters.minPrice) {
                filteredProperties = filteredProperties.filter(p => p.price >= Number(filters.minPrice));
            }
            if (filters.maxPrice) {
                filteredProperties = filteredProperties.filter(p => p.price <= Number(filters.maxPrice));
            }
            if (filters.bedrooms) {
                filteredProperties = filteredProperties.filter(p => p.bedrooms >= Number(filters.bedrooms));
            }
            if (filters.bathrooms) {
                filteredProperties = filteredProperties.filter(p => p.bathrooms >= Number(filters.bathrooms));
            }
            if (filters.location) {
                filteredProperties = filteredProperties.filter(p => 
                    p.location.toLowerCase().includes(filters.location.toLowerCase())
                );
            }

            // Apply sorting
            if (filters.sortBy) {
                filteredProperties.sort((a, b) => {
                    const aValue = a[filters.sortBy];
                    const bValue = b[filters.sortBy];
                    
                    if (filters.sortOrder === 'desc') {
                        return bValue - aValue || (typeof bValue === 'string' ? bValue.localeCompare(aValue) : 0);
                    }
                    return aValue - bValue || (typeof aValue === 'string' ? aValue.localeCompare(bValue) : 0);
                });
            }

            // Apply pagination
            const page = Number(filters.page) || 1;
            const limit = Number(filters.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            
            const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
            const totalPages = Math.ceil(filteredProperties.length / limit);

            const response = {
                success: true,
                message: 'Properties retrieved successfully',
                data: paginatedProperties,
                meta: {
                    page,
                    limit,
                    total: filteredProperties.length,
                    totalPages
                }
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving properties'
            };
            res.status(500).json(response);
        }
    };

    getPropertyById = (req, res) => {
        try {
            const { id } = req.params;
            const property = this.properties.find(p => p.id === id);

            if (!property) {
                const response = {
                    success: false,
                    message: 'Property not found'
                };
                return res.status(404).json(response);
            }

            const response = {
                success: true,
                message: 'Property retrieved successfully',
                data: property
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving property'
            };
            res.status(500).json(response);
        }
    };

    createProperty = (req, res) => {
        try {
            const propertyData = req.body;
            
            const newProperty = {
                ...propertyData,
                id: (this.properties.length + 1).toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.properties.push(newProperty);

            const response = {
                success: true,
                message: 'Property created successfully',
                data: newProperty
            };

            res.status(201).json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error creating property'
            };
            res.status(500).json(response);
        }
    };

    updateProperty = (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const propertyIndex = this.properties.findIndex(p => p.id === id);
            
            if (propertyIndex === -1) {
                const response = {
                    success: false,
                    message: 'Property not found'
                };
                return res.status(404).json(response);
            }

            this.properties[propertyIndex] = {
                ...this.properties[propertyIndex],
                ...updateData,
                id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };

            const response = {
                success: true,
                message: 'Property updated successfully',
                data: this.properties[propertyIndex]
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error updating property'
            };
            res.status(500).json(response);
        }
    };

    deleteProperty = (req, res) => {
        try {
            const { id } = req.params;
            const propertyIndex = this.properties.findIndex(p => p.id === id);
            
            if (propertyIndex === -1) {
                const response = {
                    success: false,
                    message: 'Property not found'
                };
                return res.status(404).json(response);
            }

            this.properties.splice(propertyIndex, 1);

            const response = {
                success: true,
                message: 'Property deleted successfully'
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error deleting property'
            };
            res.status(500).json(response);
        }
    };

    getFeaturedProperties = (req, res) => {
        try {
            // Return available properties sorted by price (descending) - top 3
            const featuredProperties = this.properties
                .filter(p => p.status === 'available')
                .sort((a, b) => b.price - a.price)
                .slice(0, 3);

            const response = {
                success: true,
                message: 'Featured properties retrieved successfully',
                data: featuredProperties
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving featured properties'
            };
            res.status(500).json(response);
        }
    };
}

module.exports = { PropertyController };
