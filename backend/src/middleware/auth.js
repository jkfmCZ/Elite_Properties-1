const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');

// Generate JWT token
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN 
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Check if broker exists and is active
    const brokerQuery = `
      SELECT id, uuid, email, name, title, is_active, is_admin 
      FROM brokers 
      WHERE id = ? AND is_active = TRUE
    `;
    
    const result = await executeQuery(brokerQuery, [decoded.id]);
    
    if (!result.success || result.data.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: 'Broker not found or inactive' 
      });
    }

    req.broker = result.data[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

// Admin only middleware
const requireAdmin = (req, res, next) => {
  if (!req.broker || !req.broker.is_admin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

// Optional authentication (for public endpoints that can benefit from auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const brokerQuery = `
          SELECT id, uuid, email, name, title, is_active, is_admin 
          FROM brokers 
          WHERE id = ? AND is_active = TRUE
        `;
        
        const result = await executeQuery(brokerQuery, [decoded.id]);
        
        if (result.success && result.data.length > 0) {
          req.broker = result.data[0];
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authenticateToken,
  requireAdmin,
  optionalAuth
};
