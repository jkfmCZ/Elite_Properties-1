-- Elite Properties Database Schema
-- Created: 2025-07-15

-- Create database
CREATE DATABASE IF NOT EXISTS elite_properties;
USE elite_properties;

-- Users/Brokers table for authentication and management
CREATE TABLE brokers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    experience VARCHAR(100),
    phone VARCHAR(20),
    image_url VARCHAR(500),
    specialties JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    availability ENUM('available', 'busy', 'offline') DEFAULT 'available',
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_uuid (uuid),
    INDEX idx_availability (availability),
    INDEX idx_active (is_active)
);

-- Properties table
CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    broker_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    bedrooms INT,
    bathrooms DECIMAL(3,1),
    square_footage INT,
    lot_size DECIMAL(10,2),
    year_built INT,
    property_type ENUM('house', 'apartment', 'plot', 'commercial', 'land') NOT NULL,
    status ENUM('available', 'pending', 'sold', 'rented', 'off_market') DEFAULT 'available',
    main_image_url VARCHAR(500),
    features JSON,
    amenities JSON,
    virtual_tour_url VARCHAR(500),
    video_url VARCHAR(500),
    documents JSON,
    views_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE,
    INDEX idx_uuid (uuid),
    INDEX idx_broker (broker_id),
    INDEX idx_type (property_type),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_location (city, state),
    INDEX idx_bedrooms (bedrooms),
    INDEX idx_featured (featured),
    INDEX idx_published (published),
    FULLTEXT idx_search (title, description, location)
);

-- Property images table
CREATE TABLE property_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_main BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    INDEX idx_property (property_id),
    INDEX idx_main (is_main),
    INDEX idx_sort (sort_order)
);

-- Bookings/Appointments table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    property_id INT,
    broker_id INT,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    preferred_location VARCHAR(255),
    message TEXT,
    booking_type ENUM('viewing', 'consultation', 'valuation', 'general') DEFAULT 'viewing',
    status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL,
    INDEX idx_uuid (uuid),
    INDEX idx_property (property_id),
    INDEX idx_broker (broker_id),
    INDEX idx_status (status),
    INDEX idx_date (preferred_date),
    INDEX idx_client_email (client_email)
);

-- Broker reviews table
CREATE TABLE broker_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    broker_id INT NOT NULL,
    property_id INT,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    INDEX idx_broker (broker_id),
    INDEX idx_rating (rating),
    INDEX idx_published (is_published)
);

-- Chat messages table for customer support
CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    session_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender ENUM('user', 'ai', 'broker') NOT NULL,
    message_type ENUM('text', 'booking', 'property', 'broker', 'market-insight', 'quick-actions') DEFAULT 'text',
    embed_data JSON,
    broker_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE SET NULL,
    INDEX idx_uuid (uuid),
    INDEX idx_session (session_id),
    INDEX idx_sender (sender),
    INDEX idx_type (message_type),
    INDEX idx_created (created_at)
);

-- Market insights table
CREATE TABLE market_insights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    trend ENUM('up', 'down', 'stable') NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    timeframe VARCHAR(100) NOT NULL,
    data JSON,
    location VARCHAR(255),
    property_type VARCHAR(100),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_uuid (uuid),
    INDEX idx_trend (trend),
    INDEX idx_location (location),
    INDEX idx_published (is_published)
);

-- Audit log for tracking changes
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (changed_by) REFERENCES brokers(id) ON DELETE SET NULL,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_action (action),
    INDEX idx_changed_by (changed_by),
    INDEX idx_created (created_at)
);

-- Sessions table for authentication
CREATE TABLE broker_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    broker_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE,
    INDEX idx_broker (broker_id),
    INDEX idx_session_token (session_token),
    INDEX idx_refresh_token (refresh_token),
    INDEX idx_expires (expires_at),
    INDEX idx_active (is_active)
);
