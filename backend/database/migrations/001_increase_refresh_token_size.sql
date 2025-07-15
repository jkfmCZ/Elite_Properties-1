-- Migration: Increase refresh_token column size to accommodate JWT tokens
-- Date: 2025-07-15
-- Issue: JWT tokens can be longer than 255 characters

USE elite_properties;

-- Increase refresh_token column size from VARCHAR(255) to VARCHAR(512)
-- This should be sufficient for JWT tokens which typically range from 200-400 characters
ALTER TABLE broker_sessions 
MODIFY COLUMN refresh_token VARCHAR(512) UNIQUE;

-- Also increase session_token size for consistency (though it's typically shorter)
ALTER TABLE broker_sessions 
MODIFY COLUMN session_token VARCHAR(512) UNIQUE NOT NULL;
