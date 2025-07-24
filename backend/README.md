# Elite Properties Backend API

A comprehensive Node.js/Express backend API for the Elite Properties real estate application, featuring MySQL database integration, JWT authentication, automated database setup, and complete property management capabilities.

## ✨ Features

- **🏗️ Automated Database Setup**: One-command database creation with schema and sample data
- **🔐 JWT Authentication**: Secure broker authentication and authorization
- **🏠 Property Management**: Complete CRUD operations for property listings
- **📅 Booking System**: Appointment scheduling and management
- **⭐ Review System**: Broker ratings and customer feedback
- **📊 Market Insights**: Real estate market data and analytics
- **💬 Chat API**: AI chatbot integration endpoints
- **📝 Audit Logging**: Complete change tracking for compliance
- **📁 File Upload**: Image upload handling for properties and brokers
- **🔍 Advanced Filtering**: Sophisticated search and filtering capabilities
- **📄 Pagination**: Efficient data pagination for large datasets
- **🛡️ Security**: Input validation, CORS, rate limiting, and security headers

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **MySQL** (version 8.0 or higher)

### Installation & Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   copy .env.example .env
   ```
   
   Edit the `.env` file with your MySQL credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=elite_properties
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **🆕 Setup Database (NEW FEATURE!):**
   ```bash
   npm run setup
   ```
   
   This command will:
   - Create the `elite_properties` database
   - Set up all required tables with proper relationships
   - **Automatically apply all database migrations**
   - Populate the database with sample data (4 brokers, 6 properties, bookings, reviews)
   - Display setup completion summary

5. **🔐 Create Test User Passwords:**
   ```bash
   node src/scripts/createTestPasswords.js
   ```
   
   This creates working passwords for the test accounts:
   - `john.smith@eliteproperties.com` / `password123`
   - `sarah.johnson@eliteproperties.com` / `password123`
   - `mike.davis@eliteproperties.com` / `password123`
   - `admin@eliteproperties.com` / `admin123`

6. **Start development server:**
   ```bash
   npm run dev
   ```

7. **Verify installation:**
   - API: http://localhost:5000
   - Health Check: http://localhost:5000/health
   - API Documentation: http://localhost:5000/api

The API will be available at `http://localhost:5000`

## �️ Database Setup Feature

The backend includes a powerful automated database setup system that handles everything from database creation to sample data population.

### What Gets Created

When you run `npm run setup`, the system creates:

#### Database Schema
- **elite_properties** database
- **brokers** table - Broker accounts with authentication
- **properties** table - Property listings with comprehensive details
- **property_images** table - Multiple images per property
- **bookings** table - Appointment scheduling system
- **broker_reviews** table - Customer feedback and ratings
- **market_insights** table - Real estate market data
- **audit_logs** table - Change tracking for compliance
- **user_sessions** table - Session management

#### Sample Data
- **4 Brokers**: With different specialties and experience levels
- **6 Properties**: Houses, apartments, and plots with realistic data
- **Property Images**: Sample image associations
- **Bookings**: Various appointment statuses and dates
- **Reviews**: Broker ratings and customer feedback
- **Market Data**: Sample insights and analytics

### Setup Commands

```bash
# Basic database setup - creates tables, applies migrations, and populates sample data
npm run setup

# Create test user passwords for login testing
node src/scripts/createTestPasswords.js

# Development setup - installs dependencies AND sets up database
npm run setup-dev

# Run only migrations (if needed separately)
npm run migrate

# Check database status
npm run dev  # Start server and check /health endpoint
```

> **Note**: New users only need to run `npm run setup` - migrations are automatically applied during setup.

### Test Login Credentials

After running the setup commands, use these credentials for testing:

| Email | Password | Role |
|-------|----------|------|
| `john.smith@eliteproperties.com` | `password123` | Senior Real Estate Agent |
| `sarah.johnson@eliteproperties.com` | `password123` | Property Specialist |
| `mike.davis@eliteproperties.com` | `password123` | Commercial Broker |
| `admin@eliteproperties.com` | `admin123` | System Administrator |

> **Important**: Run `node src/scripts/createTestPasswords.js` after database setup to enable login functionality.

### Database Schema Details

#### Brokers Table
```sql
- id (UUID, Primary Key)
- name (VARCHAR, Full name)
- email (VARCHAR, Unique, Authentication)
- password_hash (VARCHAR, bcrypt hashed)
- phone (VARCHAR, Contact number)
- specialization (ENUM: residential, commercial, luxury, investment)
- experience_years (INT, Years of experience)
- bio (TEXT, Professional biography)
- profile_image (VARCHAR, Image URL)
- is_available (BOOLEAN, Availability status)
- rating (DECIMAL, Average rating)
- total_reviews (INT, Number of reviews)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Properties Table
```sql
- id (UUID, Primary Key)
- title (VARCHAR, Property title)
- description (TEXT, Detailed description)
- type (ENUM: house, apartment, plot)
- status (ENUM: available, sold, pending)
- price (DECIMAL, Property price)
- location (VARCHAR, Property location)
- address (VARCHAR, Full address)
- bedrooms (INT, Number of bedrooms)
- bathrooms (INT, Number of bathrooms)
- square_footage (INT, Area in sq ft)
- year_built (INT, Construction year)
- lot_size (DECIMAL, Lot size)
- features (JSON, Property features)
- broker_id (UUID, Foreign Key to brokers)
- is_featured (BOOLEAN, Featured status)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Environment Configuration

Required environment variables:

```env
# Database Connection
DB_HOST=localhost          # MySQL host
DB_PORT=3306              # MySQL port
DB_USER=root              # MySQL username
DB_PASSWORD=password      # MySQL password
DB_NAME=elite_properties  # Database name

# Authentication
JWT_SECRET=your_256_bit_secret  # JWT signing secret

# Server
PORT=5000                 # Server port
NODE_ENV=development      # Environment mode
```

### Troubleshooting Setup

If database setup fails:

1. **Check MySQL Connection:**
   ```bash
   mysql -u root -p
   ```

2. **Verify Environment Variables:**
   - Ensure `.env` file exists and is properly configured
   - Check MySQL credentials and permissions

3. **Check MySQL Permissions:**
   ```sql
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **View Setup Logs:**
   The setup script provides detailed logging of each step

5. **Manual Verification:**
   ```bash
   # Check database creation
   mysql -u root -p -e "SHOW DATABASES;"
   
   # Check tables
   mysql -u root -p elite_properties -e "SHOW TABLES;"
   ```

For detailed database documentation, see `DATABASE_SETUP.md`.

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

#### Authentication Endpoints
```
POST /api/auth/register     # Register new broker
POST /api/auth/login        # Broker login
POST /api/auth/logout       # Logout and invalidate token
GET  /api/auth/profile      # Get current broker profile
PUT  /api/auth/profile      # Update broker profile
POST /api/auth/refresh      # Refresh JWT token
```

#### Example Registration/Login
```json
// POST /api/auth/register
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "password": "securepassword123",
  "phone": "+1-555-0123",
  "specialization": "residential",
  "experience_years": 5,
  "bio": "Experienced residential broker..."
}

// POST /api/auth/login
{
  "email": "john.smith@example.com",
  "password": "securepassword123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "broker": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "specialization": "residential"
    }
  }
}
```
### Available Endpoints

#### Root Endpoints
```
GET  /                      # API status and information
GET  /health               # Health check endpoint
GET  /api                  # API documentation
```

#### Properties
```
GET    /api/properties              # Get all properties (with filtering)
GET    /api/properties/featured     # Get featured properties
GET    /api/properties/:id          # Get property by ID
POST   /api/properties              # Create new property (auth required)
PUT    /api/properties/:id          # Update property (auth required)
DELETE /api/properties/:id          # Delete property (auth required)
POST   /api/properties/:id/images   # Upload property images (auth required)
GET    /api/properties/:id/images   # Get property images
DELETE /api/properties/:id/images/:imageId  # Delete property image (auth required)
```

#### Property Examples
```json
// GET /api/properties (with filtering)
{
  "success": true,
  "message": "Properties retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Modern Family Home",
      "description": "Beautiful 3-bedroom house with garden",
      "type": "house",
      "status": "available",
      "price": 450000,
      "location": "Austin, TX",
      "address": "123 Oak Street, Austin, TX 78701",
      "bedrooms": 3,
      "bathrooms": 2,
      "square_footage": 2100,
      "year_built": 2018,
      "features": ["garage", "garden", "modern_kitchen"],
      "broker": {
        "id": "broker_id",
        "name": "Sarah Johnson",
        "phone": "+1-555-0101"
      },
      "images": [
        {
          "id": "image_id",
          "url": "/images/properties/house1_1.jpg",
          "alt": "Front view"
        }
      ],
      "is_featured": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}

// POST /api/properties (create new)
{
  "title": "Luxury Downtown Apartment",
  "description": "Modern apartment with city views",
  "type": "apartment",
  "status": "available",
  "price": 350000,
  "location": "Downtown Austin",
  "address": "456 Main Street, Austin, TX 78701",
  "bedrooms": 2,
  "bathrooms": 2,
  "square_footage": 1200,
  "year_built": 2020,
  "features": ["balcony", "gym", "parking"],
  "is_featured": false
}
```
#### Bookings
```
GET    /api/bookings                # Get all bookings (auth required)
GET    /api/bookings/:id            # Get booking by ID
POST   /api/bookings                # Create new booking
PUT    /api/bookings/:id            # Update booking (auth required)
PATCH  /api/bookings/:id/status     # Update booking status (auth required)
DELETE /api/bookings/:id            # Delete booking (auth required)
GET    /api/bookings/broker/:id     # Get bookings for specific broker
```

#### Booking Examples
```json
// POST /api/bookings (create new booking)
{
  "property_id": "550e8400-e29b-41d4-a716-446655440000",
  "broker_id": "broker_id",
  "client_name": "Michael Johnson",
  "client_email": "michael.j@example.com",
  "client_phone": "+1-555-0789",
  "preferred_date": "2025-07-25",
  "preferred_time": "14:00",
  "message": "Interested in scheduling a viewing"
}

// Response
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking_id",
    "property_id": "550e8400-e29b-41d4-a716-446655440000",
    "broker_id": "broker_id",
    "client_name": "Michael Johnson",
    "client_email": "michael.j@example.com",
    "client_phone": "+1-555-0789",
    "preferred_date": "2025-07-25",
    "preferred_time": "14:00",
    "status": "pending",
    "message": "Interested in scheduling a viewing",
    "created_at": "2025-07-15T10:30:00Z"
  }
}

// PATCH /api/bookings/:id/status (update status)
{
  "status": "confirmed"  // pending, confirmed, completed, cancelled
}
```
#### Brokers
```
GET    /api/brokers                 # Get all brokers
GET    /api/brokers/:id             # Get broker by ID
PUT    /api/brokers/:id             # Update broker (auth required)
PATCH  /api/brokers/:id/availability # Update broker availability (auth required)
GET    /api/brokers/:id/properties  # Get properties managed by broker
GET    /api/brokers/:id/reviews     # Get reviews for broker
POST   /api/brokers/:id/reviews     # Create review for broker
```

#### Broker Examples
```json
// GET /api/brokers
{
  "success": true,
  "data": [
    {
      "id": "broker_id",
      "name": "Sarah Johnson",
      "email": "sarah.j@eliteproperties.com",
      "phone": "+1-555-0101",
      "specialization": "residential",
      "experience_years": 8,
      "bio": "Specializing in residential properties...",
      "profile_image": "/images/broker/sarah_johnson.jpg",
      "is_available": true,
      "rating": 4.8,
      "total_reviews": 23,
      "properties_count": 12
    }
  ]
}

// POST /api/brokers/:id/reviews (create review)
{
  "rating": 5,
  "comment": "Excellent service, very professional",
  "client_name": "John Doe",
  "client_email": "john@example.com"
}
```
#### Market Insights
```
GET    /api/insights                # Get all market insights
GET    /api/insights/latest         # Get latest insights
GET    /api/insights/:id            # Get insight by ID
POST   /api/insights                # Create new insight (auth required)
PUT    /api/insights/:id            # Update insight (auth required)
DELETE /api/insights/:id            # Delete insight (auth required)
GET    /api/insights/location/:location # Get insights for specific location
```

#### Market Insights Examples
```json
// GET /api/insights/latest
{
  "success": true,
  "data": [
    {
      "id": "insight_id",
      "title": "Austin Real Estate Market Update",
      "content": "The Austin market continues to show strong growth...",
      "location": "Austin, TX",
      "average_price": 425000,
      "price_change_percent": 8.5,
      "market_trend": "rising",
      "insight_type": "market_overview",
      "published_date": "2025-07-15",
      "author": "Market Analysis Team"
    }
  ]
}
```
#### Chat
```
POST   /api/chat/message            # Send chat message
GET    /api/chat/history            # Get chat history
DELETE /api/chat/history            # Clear chat history
GET    /api/chat/actions            # Get quick actions
POST   /api/chat/feedback           # Submit chat feedback
```

#### Chat Examples
```json
// POST /api/chat/message
{
  "message": "I'm looking for a 3-bedroom house under $500,000",
  "context": {
    "location": "Austin, TX",
    "filters": {
      "type": "house",
      "maxPrice": 500000,
      "bedrooms": 3
    }
  }
}

// Response
{
  "success": true,
  "data": {
    "response": "I found several 3-bedroom houses under $500,000 in Austin. Here are the best matches:",
    "properties": [
      {
        "id": "property_id",
        "title": "Charming Family Home",
        "price": 450000,
        "bedrooms": 3,
        "location": "Austin, TX"
      }
    ],
    "suggestions": [
      "Would you like to see properties with 4 bedrooms?",
      "Should I show you apartments as well?"
    ]
  }
}
```

### Query Parameters & Filtering

#### Properties Filtering
```
GET /api/properties?type=house&status=available&minPrice=100000&maxPrice=500000&bedrooms=3&location=Austin&sortBy=price&sortOrder=asc&page=1&limit=10
```

Available filters:
- **type**: `house`, `apartment`, `plot`
- **status**: `available`, `sold`, `pending`
- **minPrice**: Minimum price (number)
- **maxPrice**: Maximum price (number)
- **bedrooms**: Minimum number of bedrooms (number)
- **bathrooms**: Minimum number of bathrooms (number)
- **location**: Location search (partial match, case-insensitive)
- **year_built_min**: Minimum construction year
- **year_built_max**: Maximum construction year
- **square_footage_min**: Minimum square footage
- **square_footage_max**: Maximum square footage
- **features**: Property features (comma-separated): `garage,garden,pool`
- **broker_id**: Filter by specific broker
- **is_featured**: Show only featured properties (`true`/`false`)

#### Sorting Options
- **sortBy**: `price`, `bedrooms`, `bathrooms`, `square_footage`, `year_built`, `created_at`, `title`
- **sortOrder**: `asc` (ascending), `desc` (descending)

#### Pagination
- **page**: Page number (default: 1)
- **limit**: Items per page (default: 10, max: 50)

#### Example Queries
```bash
# Houses under $400k with at least 3 bedrooms
GET /api/properties?type=house&maxPrice=400000&bedrooms=3

# Featured properties in Austin, sorted by price
GET /api/properties?location=Austin&is_featured=true&sortBy=price&sortOrder=asc

# Apartments with modern features
GET /api/properties?type=apartment&features=modern_kitchen,balcony

# Recent properties (last 30 days)
GET /api/properties?sortBy=created_at&sortOrder=desc&limit=20
```

### Response Format

All API responses follow this standardized format:

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Response data */ },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
}
```

#### HTTP Status Codes
- **200**: Success (GET, PUT, PATCH)
- **201**: Created (POST)
- **204**: No Content (DELETE)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate resource)
- **422**: Unprocessable Entity (business logic errors)
- **500**: Internal Server Error (unexpected errors)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with nodemon (auto-restart)
npm run dev:debug        # Start with debugging enabled

# Database
npm run setup            # 🆕 Setup database with schema and sample data
npm run setup-dev        # Install dependencies + setup database
npm run db:reset         # Reset database (drop and recreate)
npm run db:seed          # Re-seed database with sample data

# Production
npm start                # Start production server
npm run build            # Build for production (if applicable)

# Code Quality
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run lint             # Run ESLint for code quality
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format code with Prettier

# Utilities
npm run logs             # View application logs
npm run health           # Check API health status
```

### Development Environment

#### Required Tools
- **Node.js 18+**: JavaScript runtime
- **MySQL 8.0+**: Database server
- **npm**: Package manager
- **Git**: Version control

#### Recommended Tools
- **MySQL Workbench**: Database management
- **Postman**: API testing
- **VS Code**: Code editor with extensions:
  - ES6 String Template Literals
  - MySQL Syntax
  - REST Client

### Project Structure

```
backend/
├── src/
│   ├── controllers/              # Route handlers and business logic
│   │   ├── authController.js        # Authentication (login/register/profile)
│   │   ├── propertyController.js    # Property CRUD operations
│   │   ├── propertyController_new.js # Enhanced property controller
│   │   ├── bookingController.js     # Booking management
│   │   ├── brokerController.js      # Broker profile management
│   │   ├── marketInsightController.js # Market data and analytics
│   │   ├── chatController.js        # Chat API endpoints
│   │   └── indexController.js       # Root endpoints and health checks
│   ├── config/                   # Configuration files
│   │   └── database.js              # MySQL connection and configuration
│   ├── middleware/               # Express middleware
│   │   ├── auth.js                  # JWT authentication middleware
│   │   ├── errorHandler.ts          # Global error handling
│   │   └── index.js                 # Middleware registration
│   ├── routes/                   # Route definitions
│   │   ├── auth.js                  # Authentication routes
│   │   ├── properties.js            # Property routes
│   │   └── index.js                 # Route registration and setup
│   ├── scripts/                  # Utility scripts
│   │   └── setupDatabase.js         # 🆕 Automated database setup
│   ├── data/                     # Data files
│   │   └── mockData.js              # Mock data (fallback)
│   └── app.js                    # Express application entry point
├── database/                     # 🆕 Database files
│   ├── schema.sql                   # MySQL database schema
│   └── seed.sql                     # Sample data for development
├── node_modules/                 # Dependencies (auto-generated)
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Dependency lock file
├── DATABASE_SETUP.md            # Detailed database documentation
└── README.md                    # This file
```

## 🚀 Testing the API

### Health Check
```bash
# PowerShell (Windows)
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get

# curl (Linux/Mac/WSL)
curl http://localhost:5000/health

# Expected Response
{
  "success": true,
  "message": "Elite Properties API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2025-07-15T10:30:00Z",
    "version": "1.0.0",
    "database": "connected",
    "uptime": "2h 15m 30s"
  }
}
```

### Testing Properties Endpoint
```bash
# Get all properties
curl http://localhost:5000/api/properties

# Get featured properties
curl http://localhost:5000/api/properties/featured

# Get properties with filters
curl "http://localhost:5000/api/properties?type=house&maxPrice=500000&bedrooms=3"

# PowerShell equivalent
Invoke-RestMethod -Uri "http://localhost:5000/api/properties" -Method Get
```

### Testing Authentication
```bash
# Register new broker
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Broker",
    "email": "test@example.com",
    "password": "securepassword123",
    "phone": "+1-555-0123",
    "specialization": "residential",
    "experience_years": 5
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'

# Use token for authenticated requests
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Testing with Postman

1. **Import Collection**: Create a Postman collection with the following requests:
   - GET Health Check: `http://localhost:5000/health`
   - GET Properties: `http://localhost:5000/api/properties`
   - POST Register: `http://localhost:5000/api/auth/register`
   - POST Login: `http://localhost:5000/api/auth/login`

2. **Environment Variables**: Set up Postman environment with:
   - `base_url`: `http://localhost:5000`
   - `token`: (set after login)

3. **Pre-request Scripts**: Auto-set authorization header:
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

## 📱 Frontend Integration

The backend is designed to work seamlessly with the React frontend.

### CORS Configuration
```javascript
// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',      // Vite dev server
  'http://localhost:3000',      // React dev server
  'https://your-frontend-domain.com'  // Production frontend
];
```

### Frontend API Integration Example
```javascript
// api.js - Frontend API service
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    return data;
  }

  // Properties
  async getProperties(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/properties?${queryParams}`);
  }

  async getPropertyById(id) {
    return this.request(`/properties/${id}`);
  }

  // Authentication
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }
    
    return response;
  }

  // Bookings
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }
}

export default new ApiService();
```

### React Component Example
```jsx
// PropertyList.jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    maxPrice: '',
    location: ''
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProperties(filters);
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div>
      <h2>Properties</h2>
      {/* Filter UI */}
      <div className="filters">
        <select 
          value={filters.type} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="plot">Plot</option>
        </select>
        {/* More filters... */}
      </div>
      
      {/* Property List */}
      <div className="property-grid">
        {properties.map(property => (
          <div key={property.id} className="property-card">
            <h3>{property.title}</h3>
            <p>${property.price.toLocaleString()}</p>
            <p>{property.location}</p>
            <p>{property.bedrooms} bed, {property.bathrooms} bath</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
```

## 🚀 Deployment

### Environment Setup

#### Development
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_local_password
DB_NAME=elite_properties
JWT_SECRET=your_dev_jwt_secret
FRONTEND_URL=http://localhost:5173
```

#### Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_PORT=3306
DB_USER=your_production_db_user
DB_PASSWORD=your_secure_production_password
DB_NAME=elite_properties
JWT_SECRET=your_super_secure_production_jwt_secret_256_bits
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options

#### 1. Heroku Deployment
```bash
# Install Heroku CLI and login
heroku login

# Create Heroku app
heroku create elite-properties-api

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret

# Deploy
git push heroku main

# Setup database
heroku run npm run setup
```

#### 2. AWS EC2 Deployment
```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js and MySQL
sudo apt update
sudo apt install nodejs npm mysql-server

# Clone repository
git clone your-repo-url
cd Elite_Properties/backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with production values

# Setup database
npm run setup

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start app.js --name elite-properties-api
pm2 startup
pm2 save
```

#### 3. DigitalOcean App Platform
```yaml
# .do/app.yaml
name: elite-properties-api
services:
  - name: api
    source_dir: /backend
    github:
      repo: your-username/Elite_Properties
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        value: your_jwt_secret
        type: SECRET
databases:
  - name: elite-properties-db
    engine: MYSQL
    version: "8"
```

#### 4. Azure App Service
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name elite-properties --location "East US"

# Create app service plan
az appservice plan create --name elite-properties-plan --resource-group elite-properties --sku FREE

# Create web app
az webapp create --resource-group elite-properties --plan elite-properties-plan --name elite-properties-api --runtime "NODE|18-lts"

# Deploy from GitHub
az webapp deployment source config --name elite-properties-api --resource-group elite-properties --repo-url https://github.com/your-username/Elite_Properties --branch main --manual-integration

# Set environment variables
az webapp config appsettings set --resource-group elite-properties --name elite-properties-api --settings NODE_ENV=production JWT_SECRET=your_secret
```

### Database Migration for Production

```bash
# Backup existing database (if any)
mysqldump -u username -p database_name > backup.sql

# Setup production database
npm run setup

# Verify database setup
npm run health
```

### SSL/HTTPS Setup

#### Using Let's Encrypt (Nginx)
```nginx
# /etc/nginx/sites-available/elite-properties-api
server {
    listen 80;
    server_name api.eliteproperties.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.eliteproperties.com;

    ssl_certificate /etc/letsencrypt/live/api.eliteproperties.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.eliteproperties.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Monitoring & Logging

#### PM2 Monitoring
```bash
# View logs
pm2 logs elite-properties-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart elite-properties-api

# View process status
pm2 status
```

#### Health Monitoring
Set up monitoring for the `/health` endpoint:
```bash
# Simple health check script
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
if [ $response != "200" ]; then
    echo "API is down - Status: $response"
    pm2 restart elite-properties-api
fi
```

## 🔒 Security Best Practices

### Environment Variables
- Use strong, randomly generated JWT secrets (256-bit)
- Never commit `.env` files to version control
- Use different secrets for development and production
- Rotate secrets regularly

### Database Security
```sql
-- Create dedicated database user
CREATE USER 'elite_api'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON elite_properties.* TO 'elite_api'@'localhost';
FLUSH PRIVILEGES;
```

### API Security
- Enable rate limiting for production
- Use HTTPS in production
- Validate all inputs
- Sanitize database queries
- Log security events

### Production Checklist
- [ ] Environment variables configured
- [ ] Database user with minimal permissions
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Health monitoring setup
- [ ] Database backups scheduled
- [ ] Security headers configured

## 🔧 Maintenance

### Regular Tasks
```bash
# Update dependencies
npm audit
npm update

# Database maintenance
npm run db:backup
npm run db:optimize

# Log rotation
pm2 flush elite-properties-api

# Security updates
npm audit fix
```

### Backup Strategy
```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p elite_properties > "backup_elite_properties_$DATE.sql"
aws s3 cp "backup_elite_properties_$DATE.sql" s3://your-backup-bucket/
```

## 📊 Performance Optimization

### Database Optimization
- Index frequently queried columns
- Use connection pooling
- Implement query caching
- Monitor slow queries

### API Optimization
- Implement response caching
- Use compression middleware
- Optimize image serving
- Implement pagination for large datasets

### Example Performance Enhancements
```javascript
// Redis caching example
const redis = require('redis');
const client = redis.createClient();

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary to Elite Properties.
