-- Sample data for Elite Properties Database
-- This file contains initial data for development and testing

USE elite_properties;

-- Insert sample brokers
INSERT INTO brokers (email, password_hash, name, title, experience, phone, specialties, rating, total_reviews, availability) VALUES
('john.smith@eliteproperties.com', '$2b$10$example_hash_1', 'John Smith', 'Senior Real Estate Agent', '8+ years', '+1-555-0101', 
 JSON_ARRAY('Luxury Homes', 'Commercial Properties', 'Investment Properties'), 4.8, 45, 'available'),

('sarah.johnson@eliteproperties.com', '$2b$10$example_hash_2', 'Sarah Johnson', 'Property Specialist', '5+ years', '+1-555-0102', 
 JSON_ARRAY('Residential', 'First-time Buyers', 'Condominiums'), 4.9, 67, 'available'),

('mike.davis@eliteproperties.com', '$2b$10$example_hash_3', 'Mike Davis', 'Commercial Broker', '12+ years', '+1-555-0103', 
 JSON_ARRAY('Commercial Real Estate', 'Office Buildings', 'Retail Spaces'), 4.7, 89, 'busy'),

('admin@eliteproperties.com', '$2b$10$example_hash_admin', 'Admin User', 'System Administrator', '10+ years', '+1-555-0100', 
 JSON_ARRAY('Administration', 'System Management'), 5.0, 1, 'available');

-- Update the last broker to be an admin
UPDATE brokers SET is_admin = TRUE WHERE email = 'admin@eliteproperties.com';

-- Insert sample properties
INSERT INTO properties (broker_id, title, description, price, location, address, city, state, zip_code, bedrooms, bathrooms, square_footage, property_type, status, main_image_url, features, amenities) VALUES
(1, 'Modern Luxury Villa', 'Beautiful 4-bedroom villa with stunning garden views and modern amenities. Perfect for families looking for comfort and elegance.', 750000.00, 'Beverly Hills, CA', '123 Luxury Lane', 'Beverly Hills', 'CA', '90210', 4, 3.0, 3200, 'house', 'available', '/images/properties/villa-1.jpg',
 JSON_ARRAY('Garden', 'Garage', 'Swimming Pool', 'Modern Kitchen', 'Walk-in Closets'),
 JSON_ARRAY('Air Conditioning', 'Heating', 'Security System', 'Landscaped Garden', 'Private Parking')),

(1, 'Downtown Penthouse', 'Spectacular penthouse with panoramic city views. Modern design with premium finishes throughout.', 1200000.00, 'Manhattan, NY', '456 Sky Tower', 'Manhattan', 'NY', '10001', 3, 2.5, 2800, 'apartment', 'available', '/images/properties/penthouse-1.jpg',
 JSON_ARRAY('City Views', 'Balcony', 'Modern Kitchen', 'Master Suite', 'High Ceilings'),
 JSON_ARRAY('Concierge Service', 'Gym', 'Rooftop Terrace', 'Smart Home System', 'Wine Cellar')),

(2, 'Cozy Family Home', 'Charming 3-bedroom home in a quiet neighborhood. Perfect for growing families with excellent schools nearby.', 450000.00, 'Austin, TX', '789 Family Street', 'Austin', 'TX', '73301', 3, 2.0, 1800, 'house', 'available', '/images/properties/family-home-1.jpg',
 JSON_ARRAY('Large Backyard', 'Two-Car Garage', 'Updated Kitchen', 'Hardwood Floors'),
 JSON_ARRAY('Central Air', 'Dishwasher', 'Washer/Dryer Hookups', 'Fenced Yard')),

(2, 'Investment Opportunity', 'Prime commercial plot in developing business district. Excellent potential for retail or office development.', 850000.00, 'Phoenix, AZ', '321 Commerce Blvd', 'Phoenix', 'AZ', '85001', NULL, NULL, NULL, 'plot', 'available', '/images/properties/plot-1.jpg',
 JSON_ARRAY('Commercial Zoning', 'High Traffic Area', 'Utilities Available', 'Corner Lot'),
 JSON_ARRAY('Water Access', 'Sewer Access', 'Electric Ready', 'Natural Gas Available')),

(3, 'Luxury Condo', 'High-end condominium with resort-style amenities. Move-in ready with designer finishes.', 325000.00, 'Miami, FL', '654 Ocean View Dr', 'Miami', 'FL', '33101', 2, 2.0, 1200, 'apartment', 'pending', '/images/properties/condo-1.jpg',
 JSON_ARRAY('Ocean Views', 'Balcony', 'In-unit Laundry', 'Walk-in Closet'),
 JSON_ARRAY('Pool', 'Fitness Center', 'Valet Parking', 'Beach Access', '24/7 Security')),

(3, 'Executive Office Space', 'Premium office space in prestigious business tower. Ideal for law firms, consulting, or corporate headquarters.', 2500000.00, 'Chicago, IL', '987 Business Plaza', 'Chicago', 'IL', '60601', NULL, NULL, 5000, 'commercial', 'available', '/images/properties/office-1.jpg',
 JSON_ARRAY('Conference Rooms', 'Reception Area', 'Executive Offices', 'Break Room', 'Server Room'),
 JSON_ARRAY('High-Speed Internet', 'Security System', 'Parking Garage', 'Public Transportation', 'Restaurants Nearby'));

-- Insert property images
INSERT INTO property_images (property_id, image_url, alt_text, is_main, sort_order) VALUES
-- Villa images
(1, '/images/properties/villa-1.jpg', 'Modern Luxury Villa - Front View', TRUE, 1),
(1, '/images/properties/villa-1-2.jpg', 'Modern Luxury Villa - Living Room', FALSE, 2),
(1, '/images/properties/villa-1-3.jpg', 'Modern Luxury Villa - Kitchen', FALSE, 3),
(1, '/images/properties/villa-1-4.jpg', 'Modern Luxury Villa - Master Bedroom', FALSE, 4),
(1, '/images/properties/villa-1-5.jpg', 'Modern Luxury Villa - Garden', FALSE, 5),

-- Penthouse images
(2, '/images/properties/penthouse-1.jpg', 'Downtown Penthouse - Main View', TRUE, 1),
(2, '/images/properties/penthouse-1-2.jpg', 'Downtown Penthouse - Living Area', FALSE, 2),
(2, '/images/properties/penthouse-1-3.jpg', 'Downtown Penthouse - Balcony View', FALSE, 3),

-- Family home images
(3, '/images/properties/family-home-1.jpg', 'Cozy Family Home - Front View', TRUE, 1),
(3, '/images/properties/family-home-1-2.jpg', 'Cozy Family Home - Backyard', FALSE, 2),

-- Plot images
(4, '/images/properties/plot-1.jpg', 'Investment Plot - Aerial View', TRUE, 1),

-- Condo images
(5, '/images/properties/condo-1.jpg', 'Luxury Condo - Ocean View', TRUE, 1),
(5, '/images/properties/condo-1-2.jpg', 'Luxury Condo - Interior', FALSE, 2),

-- Office images
(6, '/images/properties/office-1.jpg', 'Executive Office - Main Floor', TRUE, 1),
(6, '/images/properties/office-1-2.jpg', 'Executive Office - Conference Room', FALSE, 2);

-- Insert sample bookings
INSERT INTO bookings (property_id, broker_id, client_name, client_email, client_phone, preferred_date, preferred_time, preferred_location, message, booking_type, status) VALUES
(1, 1, 'Robert Williams', 'robert.williams@email.com', '+1-555-1001', '2025-07-20', '14:00:00', 'Property Location', 'Interested in viewing the villa with my family', 'viewing', 'confirmed'),
(2, 1, 'Lisa Anderson', 'lisa.anderson@email.com', '+1-555-1002', '2025-07-22', '10:30:00', 'Property Location', 'Looking for a downtown apartment for investment', 'viewing', 'pending'),
(3, 2, 'David Chen', 'david.chen@email.com', '+1-555-1003', '2025-07-18', '16:00:00', 'Property Location', 'First-time buyer, need guidance', 'consultation', 'confirmed'),
(4, 2, 'Maria Rodriguez', 'maria.rodriguez@email.com', '+1-555-1004', '2025-07-25', '11:00:00', 'Property Location', 'Commercial investment opportunity', 'viewing', 'pending'),
(5, 3, 'James Taylor', 'james.taylor@email.com', '+1-555-1005', '2025-07-19', '13:30:00', 'Property Location', 'Interested in the luxury condo', 'viewing', 'completed');

-- Insert sample broker reviews
INSERT INTO broker_reviews (broker_id, property_id, client_name, client_email, rating, review_text, is_verified, is_published) VALUES
(1, 1, 'Robert Williams', 'robert.williams@email.com', 5, 'John was incredibly professional and knowledgeable. He helped us find our dream home!', TRUE, TRUE),
(1, 2, 'Lisa Anderson', 'lisa.anderson@email.com', 5, 'Excellent service and great communication throughout the process.', TRUE, TRUE),
(2, 3, 'David Chen', 'david.chen@email.com', 5, 'Sarah made our first home buying experience smooth and stress-free.', TRUE, TRUE),
(2, NULL, 'Anonymous Buyer', 'buyer@email.com', 4, 'Very helpful and patient with all our questions.', FALSE, TRUE),
(3, 5, 'James Taylor', 'james.taylor@email.com', 5, 'Mike\'s expertise in commercial properties is outstanding.', TRUE, TRUE),
(3, 6, 'Corporate Client', 'corporate@company.com', 4, 'Professional service for our office space needs.', TRUE, TRUE);

-- Insert sample market insights
INSERT INTO market_insights (title, description, trend, percentage, timeframe, data, location, property_type, is_published) VALUES
('Beverly Hills Market Growth', 'Luxury home prices continue to rise in Beverly Hills area', 'up', 8.5, 'Last 6 months', 
 JSON_ARRAY(
   JSON_OBJECT('label', 'Jan', 'value', 750000),
   JSON_OBJECT('label', 'Feb', 'value', 765000),
   JSON_OBJECT('label', 'Mar', 'value', 778000),
   JSON_OBJECT('label', 'Apr', 'value', 785000),
   JSON_OBJECT('label', 'May', 'value', 798000),
   JSON_OBJECT('label', 'Jun', 'value', 814000)
 ), 'Beverly Hills, CA', 'house', TRUE),

('Manhattan Condo Market', 'Condominium sales showing steady growth in Manhattan', 'up', 3.2, 'Last 3 months',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Apr', 'value', 1150000),
   JSON_OBJECT('label', 'May', 'value', 1168000),
   JSON_OBJECT('label', 'Jun', 'value', 1185000)
 ), 'Manhattan, NY', 'apartment', TRUE),

('Commercial Real Estate', 'Office space demand stabilizing after recent volatility', 'stable', 0.8, 'Last quarter',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Q1', 'value', 2480000),
   JSON_OBJECT('label', 'Q2', 'value', 2500000)
 ), 'Chicago, IL', 'commercial', TRUE);

-- Update broker ratings based on reviews
UPDATE brokers SET 
    rating = (SELECT AVG(rating) FROM broker_reviews WHERE broker_id = brokers.id AND is_published = TRUE),
    total_reviews = (SELECT COUNT(*) FROM broker_reviews WHERE broker_id = brokers.id AND is_published = TRUE)
WHERE id IN (1, 2, 3);

-- Insert some sample chat messages
INSERT INTO chat_messages (session_id, content, sender, message_type, embed_data) VALUES
('session_001', 'Hello! I\'m looking for a 3-bedroom house in Austin', 'user', 'text', NULL),
('session_001', 'I found some great options for you! Here are 3-bedroom houses in Austin:', 'ai', 'property', 
 JSON_OBJECT('properties', JSON_ARRAY(JSON_OBJECT('id', '3', 'title', 'Cozy Family Home')))),
('session_002', 'Can you help me schedule a viewing?', 'user', 'text', NULL),
('session_002', 'I\'d be happy to help you schedule a viewing. Let me set that up for you.', 'ai', 'booking', NULL);

COMMIT;
