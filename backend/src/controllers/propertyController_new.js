const { executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PropertyController {
    
    getAllProperties = async (req, res) => {
        try {
            const filters = req.query;
            let query = `
                SELECT 
                    p.*, 
                    b.name as broker_name,
                    b.email as broker_email,
                    b.phone as broker_phone,
                    GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.sort_order) as image_urls
                FROM properties p
                LEFT JOIN brokers b ON p.broker_id = b.id
                LEFT JOIN property_images pi ON p.id = pi.property_id
                WHERE p.published = TRUE
            `;
            const queryParams = [];

            // Apply filters
            if (filters.type) {
                query += ' AND p.property_type = ?';
                queryParams.push(filters.type);
            }
            if (filters.status) {
                query += ' AND p.status = ?';
                queryParams.push(filters.status);
            }
            if (filters.minPrice) {
                query += ' AND p.price >= ?';
                queryParams.push(Number(filters.minPrice));
            }
            if (filters.maxPrice) {
                query += ' AND p.price <= ?';
                queryParams.push(Number(filters.maxPrice));
            }
            if (filters.bedrooms) {
                query += ' AND p.bedrooms >= ?';
                queryParams.push(Number(filters.bedrooms));
            }
            if (filters.bathrooms) {
                query += ' AND p.bathrooms >= ?';
                queryParams.push(Number(filters.bathrooms));
            }
            if (filters.location) {
                query += ' AND (p.location LIKE ? OR p.city LIKE ? OR p.state LIKE ?)';
                const locationFilter = `%${filters.location}%`;
                queryParams.push(locationFilter, locationFilter, locationFilter);
            }

            query += ' GROUP BY p.id';

            // Apply sorting
            if (filters.sortBy) {
                const validSortFields = ['price', 'bedrooms', 'bathrooms', 'square_footage', 'created_at'];
                if (validSortFields.includes(filters.sortBy)) {
                    const sortOrder = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
                    query += ` ORDER BY p.${filters.sortBy} ${sortOrder}`;
                }
            } else {
                query += ' ORDER BY p.featured DESC, p.created_at DESC';
            }

            // Apply pagination
            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 20;
            const offset = (page - 1) * limit;
            query += ' LIMIT ? OFFSET ?';
            queryParams.push(limit, offset);

            const result = await executeQuery(query, queryParams);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch properties'
                });
            }

            // Process results
            const properties = result.data.map(property => {
                // Parse JSON fields
                try {
                    property.features = JSON.parse(property.features || '[]');
                    property.amenities = JSON.parse(property.amenities || '[]');
                } catch (e) {
                    property.features = [];
                    property.amenities = [];
                }

                // Process images
                if (property.image_urls) {
                    property.images = property.image_urls.split(',').filter(url => url);
                } else {
                    property.images = [];
                }
                
                // Set main image for backwards compatibility
                property.imageUrl = property.main_image_url || (property.images.length > 0 ? property.images[0] : '');

                // Remove raw image_urls field
                delete property.image_urls;

                return property;
            });

            // Get total count for pagination
            const countQuery = `
                SELECT COUNT(DISTINCT p.id) as total 
                FROM properties p 
                WHERE p.published = TRUE
                ${filters.type ? 'AND p.property_type = ?' : ''}
                ${filters.status ? 'AND p.status = ?' : ''}
                ${filters.minPrice ? 'AND p.price >= ?' : ''}
                ${filters.maxPrice ? 'AND p.price <= ?' : ''}
                ${filters.bedrooms ? 'AND p.bedrooms >= ?' : ''}
                ${filters.bathrooms ? 'AND p.bathrooms >= ?' : ''}
                ${filters.location ? 'AND (p.location LIKE ? OR p.city LIKE ? OR p.state LIKE ?)' : ''}
            `;

            const countParams = [];
            if (filters.type) countParams.push(filters.type);
            if (filters.status) countParams.push(filters.status);
            if (filters.minPrice) countParams.push(Number(filters.minPrice));
            if (filters.maxPrice) countParams.push(Number(filters.maxPrice));
            if (filters.bedrooms) countParams.push(Number(filters.bedrooms));
            if (filters.bathrooms) countParams.push(Number(filters.bathrooms));
            if (filters.location) {
                const locationFilter = `%${filters.location}%`;
                countParams.push(locationFilter, locationFilter, locationFilter);
            }

            const countResult = await executeQuery(countQuery, countParams);
            const total = countResult.success ? countResult.data[0].total : 0;

            res.json({
                success: true,
                data: {
                    properties,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get properties error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch properties'
            });
        }
    };

    getPropertyById = async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                SELECT 
                    p.*, 
                    b.name as broker_name,
                    b.email as broker_email,
                    b.phone as broker_phone,
                    b.title as broker_title,
                    b.rating as broker_rating
                FROM properties p
                LEFT JOIN brokers b ON p.broker_id = b.id
                WHERE p.uuid = ? AND p.published = TRUE
            `;

            const result = await executeQuery(query, [id]);

            if (!result.success || result.data.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            const property = result.data[0];

            // Get property images
            const imagesQuery = `
                SELECT image_url, alt_text, is_main, sort_order
                FROM property_images 
                WHERE property_id = ?
                ORDER BY sort_order ASC
            `;
            
            const imagesResult = await executeQuery(imagesQuery, [property.id]);
            
            if (imagesResult.success) {
                property.images = imagesResult.data.map(img => img.image_url);
                const mainImage = imagesResult.data.find(img => img.is_main);
                property.imageUrl = mainImage ? mainImage.image_url : (property.images[0] || '');
            } else {
                property.images = [];
                property.imageUrl = property.main_image_url || '';
            }

            // Parse JSON fields
            try {
                property.features = JSON.parse(property.features || '[]');
                property.amenities = JSON.parse(property.amenities || '[]');
            } catch (e) {
                property.features = [];
                property.amenities = [];
            }

            // Increment view count
            await executeQuery(
                'UPDATE properties SET views_count = views_count + 1 WHERE id = ?',
                [property.id]
            );

            res.json({
                success: true,
                data: property
            });

        } catch (error) {
            console.error('Get property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch property'
            });
        }
    };

    createProperty = async (req, res) => {
        try {
            const brokerId = req.broker.id;
            const {
                title,
                description,
                price,
                location,
                address,
                city,
                state,
                zipCode,
                country = 'USA',
                bedrooms,
                bathrooms,
                squareFootage,
                lotSize,
                yearBuilt,
                propertyType,
                status = 'available',
                features = [],
                amenities = [],
                images = []
            } = req.body;

            if (!title || !price || !location || !propertyType) {
                return res.status(400).json({
                    success: false,
                    message: 'Title, price, location, and property type are required'
                });
            }

            const propertyUuid = uuidv4();

            const insertQuery = `
                INSERT INTO properties (
                    uuid, broker_id, title, description, price, location, address,
                    city, state, zip_code, country, bedrooms, bathrooms, 
                    square_footage, lot_size, year_built, property_type, status,
                    features, amenities, main_image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const insertResult = await executeQuery(insertQuery, [
                propertyUuid,
                brokerId,
                title,
                description,
                price,
                location,
                address,
                city,
                state,
                zipCode,
                country,
                bedrooms,
                bathrooms,
                squareFootage,
                lotSize,
                yearBuilt,
                propertyType,
                status,
                JSON.stringify(features),
                JSON.stringify(amenities),
                images.length > 0 ? images[0] : null
            ]);

            if (!insertResult.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create property'
                });
            }

            const propertyId = insertResult.data.insertId;

            // Insert property images
            if (images.length > 0) {
                const imageInserts = images.map((imageUrl, index) => [
                    propertyId,
                    imageUrl,
                    `${title} - Image ${index + 1}`,
                    index === 0, // First image is main
                    index + 1
                ]);

                const imageQuery = `
                    INSERT INTO property_images (property_id, image_url, alt_text, is_main, sort_order)
                    VALUES ?
                `;

                await executeQuery(imageQuery, [imageInserts]);
            }

            res.status(201).json({
                success: true,
                message: 'Property created successfully',
                data: {
                    id: propertyId,
                    uuid: propertyUuid
                }
            });

        } catch (error) {
            console.error('Create property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create property'
            });
        }
    };

    updateProperty = async (req, res) => {
        try {
            const { id } = req.params;
            const brokerId = req.broker.id;
            const isAdmin = req.broker.is_admin;

            // Check if property exists and user has permission
            const checkQuery = `
                SELECT id, broker_id FROM properties 
                WHERE uuid = ? AND published = TRUE
            `;

            const checkResult = await executeQuery(checkQuery, [id]);

            if (!checkResult.success || checkResult.data.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            const property = checkResult.data[0];

            // Check if user has permission (owner or admin)
            if (property.broker_id !== brokerId && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to update this property'
                });
            }

            const updateData = req.body;
            const allowedFields = [
                'title', 'description', 'price', 'location', 'address', 'city', 
                'state', 'zip_code', 'country', 'bedrooms', 'bathrooms', 
                'square_footage', 'lot_size', 'year_built', 'property_type', 
                'status', 'features', 'amenities', 'featured', 'published'
            ];

            const updateFields = [];
            const updateValues = [];

            Object.keys(updateData).forEach(field => {
                if (allowedFields.includes(field)) {
                    updateFields.push(`${field} = ?`);
                    if (field === 'features' || field === 'amenities') {
                        updateValues.push(JSON.stringify(updateData[field]));
                    } else {
                        updateValues.push(updateData[field]);
                    }
                }
            });

            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid fields to update'
                });
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateValues.push(property.id);

            const updateQuery = `
                UPDATE properties 
                SET ${updateFields.join(', ')}
                WHERE id = ?
            `;

            const updateResult = await executeQuery(updateQuery, updateValues);

            if (!updateResult.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update property'
                });
            }

            res.json({
                success: true,
                message: 'Property updated successfully'
            });

        } catch (error) {
            console.error('Update property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update property'
            });
        }
    };

    deleteProperty = async (req, res) => {
        try {
            const { id } = req.params;
            const brokerId = req.broker.id;
            const isAdmin = req.broker.is_admin;

            // Check if property exists and user has permission
            const checkQuery = `
                SELECT id, broker_id FROM properties 
                WHERE uuid = ?
            `;

            const checkResult = await executeQuery(checkQuery, [id]);

            if (!checkResult.success || checkResult.data.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Property not found'
                });
            }

            const property = checkResult.data[0];

            // Check if user has permission (owner or admin)
            if (property.broker_id !== brokerId && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to delete this property'
                });
            }

            // Soft delete - set published to false
            const deleteQuery = `
                UPDATE properties 
                SET published = FALSE, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            const deleteResult = await executeQuery(deleteQuery, [property.id]);

            if (!deleteResult.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete property'
                });
            }

            res.json({
                success: true,
                message: 'Property deleted successfully'
            });

        } catch (error) {
            console.error('Delete property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete property'
            });
        }
    };

    // Get properties for current broker (dashboard)
    getMyProperties = async (req, res) => {
        try {
            const brokerId = req.broker.id;
            const filters = req.query;

            let query = `
                SELECT 
                    p.*, 
                    COUNT(DISTINCT b.id) as booking_count,
                    COUNT(DISTINCT pi.id) as image_count
                FROM properties p
                LEFT JOIN bookings b ON p.id = b.property_id AND b.status IN ('pending', 'confirmed')
                LEFT JOIN property_images pi ON p.id = pi.property_id
                WHERE p.broker_id = ?
            `;
            const queryParams = [brokerId];

            // Add status filter if provided
            if (filters.status) {
                query += ' AND p.status = ?';
                queryParams.push(filters.status);
            }

            // Add published filter if provided
            if (filters.published !== undefined) {
                query += ' AND p.published = ?';
                queryParams.push(filters.published === 'true');
            }

            query += ' GROUP BY p.id ORDER BY p.created_at DESC';

            const result = await executeQuery(query, queryParams);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch properties'
                });
            }

            const properties = result.data.map(property => {
                // Parse JSON fields
                try {
                    property.features = JSON.parse(property.features || '[]');
                    property.amenities = JSON.parse(property.amenities || '[]');
                } catch (e) {
                    property.features = [];
                    property.amenities = [];
                }

                return property;
            });

            res.json({
                success: true,
                data: properties
            });

        } catch (error) {
            console.error('Get my properties error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch properties'
            });
        }
    };
}

const propertyController = new PropertyController();
module.exports = propertyController;
