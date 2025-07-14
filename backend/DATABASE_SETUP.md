# Elite Properties Database Setup

This document explains how to set up and use the MySQL database for the Elite Properties backend with broker dashboard functionality.

## Database Features

- **Broker Authentication**: Secure login system for brokers
- **Property Management**: Full CRUD operations for properties
- **Image Management**: Multiple images per property with main image support
- **Booking System**: Appointment scheduling and management
- **Review System**: Broker ratings and reviews
- **Market Insights**: Real estate market data tracking
- **Audit Logging**: Track all changes for compliance
- **Session Management**: Secure JWT-based authentication

## Quick Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Make sure your `.env` file has the MySQL configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=UlAlP1Q2uBXM8V
   DB_NAME=elite_properties
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   ```

3. **Setup Database**:
   ```bash
   npm run setup
   ```

4. **Start the Server**:
   ```bash
   npm run dev
   ```

## Database Schema

### Main Tables

- **`brokers`**: Broker accounts with authentication
- **`properties`**: Property listings with full details
- **`property_images`**: Multiple images per property
- **`bookings`**: Appointment scheduling
- **`broker_reviews`**: Broker ratings and feedback
- **`market_insights`**: Market trend data
- **`audit_log`**: Change tracking
- **`broker_sessions`**: Authentication sessions

## API Endpoints

### Authentication
- `POST /api/auth/login` - Broker login
- `POST /api/auth/register` - Create new broker (admin only)
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current broker profile

### Properties
- `GET /api/properties` - Get all properties (public)
- `GET /api/properties/:id` - Get property details (public)
- `POST /api/properties` - Create property (broker only)
- `PUT /api/properties/:id` - Update property (owner/admin only)
- `DELETE /api/properties/:id` - Delete property (owner/admin only)
- `GET /api/properties/dashboard/my-properties` - Get broker's properties

### Features

#### Broker Dashboard
- View all owned properties
- Add new properties with multiple images
- Edit property details
- Manage property status (available, pending, sold)
- View property statistics (views, bookings)

#### Property Management
- Rich property details (bedrooms, bathrooms, square footage, etc.)
- Multiple images with main image selection
- Features and amenities as JSON arrays
- Location details (address, city, state, zip)
- Property types (house, apartment, plot, commercial, land)

#### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access (admin/broker)
- Session management
- Audit logging

## Sample Data

The setup includes sample data:
- 4 brokers (including 1 admin)
- 6 properties across different types
- Property images and details
- Sample bookings and reviews
- Market insights data

## Default Admin Account

After setup, you can create an admin account using the register endpoint. The sample data includes brokers you can reference for testing.

## Development Workflow

1. **Add New Property** (via API):
   ```bash
   curl -X POST http://localhost:5000/api/properties \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "title": "Beautiful Family Home",
       "description": "Perfect for families",
       "price": 500000,
       "location": "Austin, TX",
       "propertyType": "house",
       "bedrooms": 3,
       "bathrooms": 2,
       "squareFootage": 2000
     }'
   ```

2. **Get Properties**:
   ```bash
   curl http://localhost:5000/api/properties
   ```

3. **Login as Broker**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john.smith@eliteproperties.com",
       "password": "your_password"
     }'
   ```

## Database Maintenance

### Backup
```bash
mysqldump -u root -p elite_properties > backup.sql
```

### Restore
```bash
mysql -u root -p elite_properties < backup.sql
```

### Reset Database
```bash
npm run setup
```

## Troubleshooting

1. **Connection Issues**: Verify MySQL is running and credentials are correct
2. **Permission Denied**: Ensure the database user has proper privileges
3. **Port Conflicts**: Check if port 3306 is available
4. **JWT Errors**: Verify JWT_SECRET is set in environment variables

## Next Steps

1. Implement file upload for property images
2. Add email notifications for bookings
3. Implement real-time chat functionality
4. Add property search with filters
5. Implement broker analytics dashboard
