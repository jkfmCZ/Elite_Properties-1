const { executeQuery } = require('../config/database');
const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  generateRefreshToken,
  verifyToken 
} = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Login broker
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find broker by email
    const brokerQuery = `
      SELECT id, uuid, email, password_hash, name, title, is_active, is_admin
      FROM brokers 
      WHERE email = ? AND is_active = TRUE
    `;

    const result = await executeQuery(brokerQuery, [email]);

    if (!result.success || result.data.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const broker = result.data[0];

    // Verify password
    const isValidPassword = await comparePassword(password, broker.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const tokenPayload = { 
      id: broker.id, 
      uuid: broker.uuid, 
      email: broker.email,
      isAdmin: broker.is_admin 
    };
    
    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update last login
    await executeQuery(
      'UPDATE brokers SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [broker.id]
    );

    // Store session (optional - for tracking active sessions)
    const sessionToken = uuidv4();
    await executeQuery(`
      INSERT INTO broker_sessions (broker_id, session_token, refresh_token, expires_at, ip_address, user_agent)
      VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR), ?, ?)
    `, [
      broker.id,
      sessionToken,
      refreshToken,
      req.ip || req.connection.remoteAddress,
      req.get('User-Agent') || ''
    ]);

    // Remove sensitive data
    delete broker.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        broker,
        accessToken,
        refreshToken,
        sessionToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Register new broker (admin only)
const register = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      title, 
      experience, 
      phone, 
      specialties,
      isAdmin = false 
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Check if broker already exists
    const existingBroker = await executeQuery(
      'SELECT id FROM brokers WHERE email = ?',
      [email]
    );

    if (existingBroker.success && existingBroker.data.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Broker with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const brokerUuid = uuidv4();

    // Insert new broker
    const insertQuery = `
      INSERT INTO brokers (
        uuid, email, password_hash, name, title, experience, 
        phone, specialties, is_admin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertResult = await executeQuery(insertQuery, [
      brokerUuid,
      email,
      passwordHash,
      name,
      title || '',
      experience || '',
      phone || '',
      JSON.stringify(specialties || []),
      isAdmin
    ]);

    if (!insertResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create broker account'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Broker account created successfully',
      data: {
        id: insertResult.data.insertId,
        uuid: brokerUuid,
        email,
        name,
        title
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if session exists and is active
    const sessionQuery = `
      SELECT bs.*, b.email, b.name, b.is_active, b.is_admin
      FROM broker_sessions bs
      JOIN brokers b ON bs.broker_id = b.id
      WHERE bs.refresh_token = ? AND bs.is_active = TRUE AND bs.expires_at > NOW()
    `;

    const sessionResult = await executeQuery(sessionQuery, [refreshToken]);

    if (!sessionResult.success || sessionResult.data.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const session = sessionResult.data[0];

    // Generate new access token
    const tokenPayload = {
      id: session.broker_id,
      uuid: decoded.uuid,
      email: session.email,
      isAdmin: session.is_admin
    };

    const newAccessToken = generateToken(tokenPayload);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { sessionToken } = req.body;
    const brokerId = req.broker.id;

    if (sessionToken) {
      // Deactivate specific session
      await executeQuery(
        'UPDATE broker_sessions SET is_active = FALSE WHERE session_token = ? AND broker_id = ?',
        [sessionToken, brokerId]
      );
    } else {
      // Deactivate all sessions for the broker
      await executeQuery(
        'UPDATE broker_sessions SET is_active = FALSE WHERE broker_id = ?',
        [brokerId]
      );
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Get current broker profile
const getProfile = async (req, res) => {
  try {
    const brokerId = req.broker.id;

    const profileQuery = `
      SELECT 
        id, uuid, email, name, title, experience, phone, 
        specialties, rating, total_reviews, availability, 
        image_url, is_admin, created_at, last_login
      FROM brokers 
      WHERE id = ? AND is_active = TRUE
    `;

    const result = await executeQuery(profileQuery, [brokerId]);

    if (!result.success || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Broker profile not found'
      });
    }

    const broker = result.data[0];
    
    // Parse specialties JSON
    try {
      broker.specialties = JSON.parse(broker.specialties || '[]');
    } catch (e) {
      broker.specialties = [];
    }

    res.json({
      success: true,
      data: broker
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  getProfile
};
