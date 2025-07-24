# Elite Properties

A comprehensive real estate application featuring a modern React/TypeScript frontend and robust Node.js/Express backend with MySQL database integration. The platform offers an intuitive interface for browsing properties, managing broker dashboards, booking appointments, and includes AI-powered chat assistance.

## ✨ Features

### Frontend Features
- **Property Listings**: Browse through a curated collection of premium properties
- **Advanced Search & Filtering**: Find properties by type, price range, location, and specifications
- **Property Details**: Detailed property pages with image galleries and comprehensive information
- **Favorites System**: Save and manage your favorite properties across all pages
- **AI Chat Assistant**: Get instant help with property inquiries and broker connections
- **Broker Information**: Connect with experienced real estate professionals
- **Dark/Light Mode**: Toggle between themes for optimal viewing experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Gallery**: Multi-image property galleries with thumbnail navigation

### Backend Features
- **RESTful API**: Complete REST API with standardized responses
- **Database Integration**: MySQL database with automated setup and seeding
- **Broker Authentication**: JWT-based secure authentication system
- **Property Management**: Full CRUD operations for properties with image support
- **Booking System**: Appointment scheduling and management
- **Review System**: Broker ratings and customer feedback
- **Market Insights**: Real estate market data and analytics
- **Audit Logging**: Complete change tracking for compliance
- **File Upload**: Image upload handling for properties and brokers

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **MySQL** (version 8.0 or higher) - for backend database
- **Git** (for version control)

### Full Stack Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Elite_Properties
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   
   # Copy environment template
   copy .env.example .env
   
   # Configure your .env file with MySQL credentials
   # DB_HOST=localhost
   # DB_PORT=3306
   # DB_USER=root
   # DB_PASSWORD=your_password
   # DB_NAME=elite_properties
   # JWT_SECRET=your_super_secret_jwt_key
   # JWT_EXPIRES_IN=7d
   # JWT_REFRESH_EXPIRES_IN=30d
   
   # Setup database (creates tables and seeds data)
   npm run setup
   
   # Create test user passwords (IMPORTANT!)
   node src/scripts/createTestPasswords.js
   
   # Start backend server
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal):
   ```bash
   cd client
   npm install
   
   # Start frontend development server
   npm run dev
   ```

4. **Access the application**:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **API Documentation**: http://localhost:5000/api

### Quick Start (Frontend Only)

If you want to run just the frontend with mock data:

1. **Navigate to frontend directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

### Available Scripts

#### Frontend Scripts (from `/client` directory)
- `npm run dev` - Start the frontend development server (http://localhost:5173)
- `npm run dev:mobile` - Start with mobile access (accessible on local network)
- `npm run build` - Build the frontend application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

#### Backend Scripts (from `/backend` directory)
- `npm run dev` - Start the backend development server with auto-reload (http://localhost:5000)
- `npm start` - Start the backend production server
- `npm run setup` - **NEW!** Setup MySQL database with schema and seed data
- `npm run setup-dev` - Install dependencies and setup database in one command
- `npm run migrate` - **NEW!** Run database migrations only
- `npm test` - Run backend tests
- `npm run lint` - Run ESLint for backend code quality
- `npm run format` - Format backend code with Prettier

## 🏗️ Project Structure

```
Elite_Properties/
├── backend/                          # Node.js/Express API Server
│   ├── database/
│   │   ├── schema.sql               # MySQL database schema
│   │   ├── seed.sql                 # Sample data for development
│   │   └── migrations/              # 🆕 Database migration files
│   │       ├── 001_increase_refresh_token_size.sql
│   │       └── README.md            # Migration documentation
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database connection configuration
│   │   ├── controllers/             # API route handlers
│   │   │   ├── authController.js    # Authentication (login/register)
│   │   │   ├── propertyController.js # Property CRUD operations
│   │   │   ├── bookingController.js # Booking management
│   │   │   ├── brokerController.js  # Broker management
│   │   │   ├── chatController.js    # Chat API endpoints
│   │   │   └── marketInsightController.js # Market data
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.js              # JWT authentication middleware
│   │   │   ├── errorHandler.ts      # Global error handling
│   │   │   └── index.js             # Middleware registration
│   │   ├── routes/                  # API route definitions
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── properties.js        # Property routes
│   │   │   └── index.js             # Route registration
│   │   ├── scripts/
│   │   │   ├── setupDatabase.js     # 🆕 Automated database setup
│   │   │   └── runMigrations.js     # 🆕 Database migration runner
│   │   ├── data/
│   │   │   └── mockData.js          # Mock data (fallback)
│   │   └── app.js                   # Express application entry point
│   ├── package.json                 # Backend dependencies and scripts
│   ├── .env.example                 # Environment variables template
│   ├── DATABASE_SETUP.md            # Database setup documentation
│   └── README.md                    # Backend-specific documentation
├── client/                          # React/TypeScript Frontend
│   ├── public/
│   │   └── images/
│   │       ├── broker/              # Broker profile images
│   │       └── properties/          # Property images
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI components (shadcn/ui)
│   │   │   ├── ChatPage.tsx         # AI chat assistant
│   │   │   ├── HomePage.tsx         # Landing page
│   │   │   ├── Navigation.tsx       # Main navigation
│   │   │   ├── PropertiesPage.tsx   # Property listings
│   │   │   ├── PropertyCard.tsx     # Individual property cards
│   │   │   ├── PropertyDetailPage.tsx # Detailed property view
│   │   │   └── ScrollToTop.tsx      # Auto-scroll utility
│   │   ├── data/
│   │   │   └── mockData.ts          # Frontend mock data
│   │   ├── hooks/
│   │   │   ├── useDarkMode.ts       # Dark mode functionality
│   │   │   ├── useLocalStorage.ts   # Local storage utilities
│   │   │   └── use-toast.ts         # Toast notifications
│   │   ├── lib/
│   │   │   └── utils.ts             # Utility functions
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript type definitions
│   │   ├── utils/
│   │   │   └── chatBot.ts           # AI chatbot logic
│   │   ├── App.tsx                  # Main application component
│   │   └── main.tsx                 # Application entry point
│   ├── components.json              # shadcn/ui configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── vite.config.ts               # Vite build configuration
│   ├── package.json                 # Frontend dependencies and scripts
│   └── README.md                    # Frontend-specific documentation
├── docs/                            # Project documentation
│   └── ROADMAP-PROPERTY.png         # Project roadmap
├── README.md                        # Main project documentation (this file)
└── .gitignore                       # Git ignore rules
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development and optimized builds)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **UI Components**: shadcn/ui (Radix UI primitives with Tailwind)
- **Icons**: Lucide React & Tabler Icons
- **Animations**: Framer Motion (smooth transitions and animations)
- **Routing**: React Router DOM (client-side routing)
- **State Management**: React Hooks + Local Storage
- **Form Handling**: React Hook Form with Zod validation
- **Code Quality**: ESLint + TypeScript strict mode

### Backend
- **Runtime**: Node.js (JavaScript/ES6+)
- **Framework**: Express.js (minimal and flexible web framework)
- **Database**: MySQL 8.0+ (relational database)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **API Documentation**: RESTful API with standardized responses
- **File Upload**: Multer (multipart/form-data handling)
- **Validation**: Joi (schema validation)
- **Security**: Helmet (security headers), CORS (cross-origin requests)
- **Development**: Nodemon (auto-reload), Morgan (HTTP logging)
- **Testing**: Jest (unit and integration testing)

### Database Features
- **Schema Management**: Automated schema creation and updates
- **Data Seeding**: Sample data for development and testing
- **Relationships**: Foreign keys and referential integrity
- **Indexing**: Optimized queries with proper indexing
- **UUID Support**: Secure unique identifiers
- **Audit Trails**: Created/updated timestamps on all tables

## �️ Database Setup Feature

The backend includes a powerful automated database setup system that creates and populates your MySQL database with all necessary tables and sample data.

### What the Setup Does

When you run `npm run setup` in the backend directory, the script will:

1. **Connect to MySQL** using your environment configuration
2. **Create Database**: Creates the `elite_properties` database if it doesn't exist
3. **Execute Schema**: Creates all tables with proper relationships and indexes:
   - `brokers` - Broker accounts with authentication
   - `properties` - Property listings with full details
   - `property_images` - Multiple images per property
   - `bookings` - Appointment scheduling
   - `broker_reviews` - Customer feedback and ratings
   - `market_insights` - Real estate market data
   - `audit_logs` - Change tracking for compliance
   - `user_sessions` - Session management
4. **Seed Sample Data**: Populates tables with realistic sample data:
   - 4 sample brokers with different specialties
   - 6 diverse properties (houses, apartments, plots)
   - Property images and broker profiles
   - Sample bookings and reviews
   - Market insights data

### Setup Commands

```bash
# Basic setup - creates database and tables
npm run setup

# Create test user passwords for login testing
node src/scripts/createTestPasswords.js

# Development setup - installs dependencies and sets up database
npm run setup-dev

# Check if setup was successful
npm run dev  # Start server and check http://localhost:5000/health
```

### Test User Credentials

After running the setup commands, you can login with these test accounts:

| Email | Password | Role |
|-------|----------|------|
| `john.smith@eliteproperties.com` | `password123` | Broker |
| `sarah.johnson@eliteproperties.com` | `password123` | Broker |
| `mike.davis@eliteproperties.com` | `password123` | Broker |
| `admin@eliteproperties.com` | `admin123` | Admin |

> **Note**: These are development/testing credentials only. In production, use the register endpoint to create secure accounts.

### Environment Configuration

Before running setup, configure your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=elite_properties

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Troubleshooting Database Setup

If setup fails, check:
1. MySQL server is running
2. Database credentials are correct
3. User has permission to create databases
4. MySQL version is 8.0 or higher

### Common Issues and Solutions

#### JWT Token Issues
- **Error**: "expiresIn should be a number of seconds or string representing a timespan"
- **Solution**: Ensure JWT_EXPIRES_IN and JWT_REFRESH_EXPIRES_IN are set in .env file

#### Database Token Storage Issues  
- **Error**: "Data too long for column 'refresh_token'"
- **Solution**: Run migrations to update column sizes: `npm run migrate`

#### Database Connection Issues
- **Error**: "Access denied for user"
- **Solution**: Check MySQL credentials and user permissions
- **Error**: "Cannot connect to MySQL server"
- **Solution**: Ensure MySQL service is running

For detailed database documentation, see `backend/DATABASE_SETUP.md`.

## 🔄 Database Migration System

Elite Properties includes a robust database migration system to handle schema changes and updates safely across different environments.

### Migration Features

- **Automated Migration Detection**: Setup script automatically detects and applies pending migrations
- **Safe Execution**: Gracefully handles already-applied migrations without errors
- **Version Control**: Migrations are numbered and executed in order
- **Rollback Protection**: Prevents duplicate applications of the same migration
- **Environment Consistency**: Ensures all environments have the same database structure

### Available Migration Commands

```bash
# Run migrations only (without full database setup)
npm run migrate

# Full database setup (includes migrations)
npm run setup

# Development setup with migrations
npm run setup-dev
```

### Current Migrations

#### Migration 001: Increase Refresh Token Size
- **File**: `001_increase_refresh_token_size.sql`
- **Purpose**: Fixed JWT token storage issues by increasing column sizes
- **Changes**:
  - `broker_sessions.session_token`: VARCHAR(255) → VARCHAR(512)
  - `broker_sessions.refresh_token`: VARCHAR(255) → VARCHAR(512)
- **Reason**: JWT tokens can exceed 255 characters, causing login failures

### Creating New Migrations

1. **Create migration file** in `backend/database/migrations/`:
   ```
   002_your_migration_name.sql
   ```

2. **Use proper SQL syntax**:
   ```sql
   -- Migration: Description of changes
   -- Date: YYYY-MM-DD
   
   USE elite_properties;
   
   -- Your migration SQL here
   ALTER TABLE table_name ADD COLUMN new_column VARCHAR(255);
   ```

3. **Test migration**:
   ```bash
   npm run migrate
   ```

### Migration Best Practices

- **Naming**: Use sequential numbers (001, 002, etc.) followed by descriptive names
- **Documentation**: Include clear comments about what the migration does
- **Testing**: Test migrations on development data before production
- **Reversibility**: Consider how to reverse changes if needed
- **Backup**: Always backup production databases before applying migrations

### Migration Safety

The migration system includes several safety features:
- **Duplicate Detection**: Skips migrations that have already been applied
- **Error Handling**: Provides clear error messages and continues with other migrations
- **Connection Management**: Properly manages database connections
- **Logging**: Detailed logging of migration status and results

## 📱 Key Features Overview

### Frontend Features

#### Property Management
- **Property Cards**: Interactive cards with heart/favorite functionality
- **Image Galleries**: Multi-image support with thumbnail navigation
- **Property Types**: Houses, Apartments, and Land Plots
- **Status Tracking**: Available, Sold, Pending status indicators
- **Advanced Filtering**: Filter by type, price, location, bedrooms, bathrooms

#### User Experience
- **Favorites System**: Heart icons on all property cards to save favorites
- **Toast Notifications**: User feedback for all actions
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first approach with touch-friendly controls
- **Dark/Light Mode**: Persistent theme switching with smooth transitions

#### Chat Assistant
- **AI-Powered**: Intelligent responses to property inquiries
- **Property Recommendations**: Embedded property cards in chat responses
- **Broker Connections**: Direct links to contact real estate agents
- **Quick Actions**: Predefined buttons for common tasks and queries

#### Navigation & Layout
- **Dynamic Navigation**: Responsive navigation with mobile hamburger menu
- **Broker Information**: Responsive broker details section with contact info
- **Mobile Optimization**: Collapsible navigation and optimized layouts
- **Scroll Management**: Automatic scroll to top on page changes

### Backend Features

#### API Management
- **RESTful Design**: Standardized API responses with consistent error handling
- **Authentication**: JWT-based secure authentication with refresh tokens
- **Validation**: Request validation using Joi schemas
- **Pagination**: Efficient pagination for large datasets
- **Filtering & Sorting**: Advanced query parameters for data retrieval

#### Data Management
- **CRUD Operations**: Complete Create, Read, Update, Delete for all entities
- **File Uploads**: Image upload handling with validation and storage
- **Database Relationships**: Properly normalized database with foreign keys
- **Transaction Support**: Database transactions for data consistency
- **Audit Logging**: Complete change tracking for compliance and debugging

#### Security Features
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication with expiration handling
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Sanitization**: Protection against SQL injection and XSS attacks
- **Rate Limiting**: API rate limiting to prevent abuse

## 🎨 Design System

The application uses a consistent design system with:
- **Color Palette**: Emerald primary with gray neutrals
- **Typography**: Modern, readable font hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components from shadcn/ui
- **Animations**: Subtle hover effects and transitions

## 🚀 Deployment

### Frontend Deployment

1. **Build for production**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service:
   - **Vercel**: Connect GitHub repo for automatic deployments
   - **Netlify**: Drag and drop the `dist` folder or connect repo
   - **AWS S3 + CloudFront**: Static website hosting
   - **Azure Static Web Apps**: GitHub integration

### Backend Deployment

1. **Prepare for production**:
   ```bash
   cd backend
   
   # Set production environment variables
   export NODE_ENV=production
   export PORT=5000
   export JWT_SECRET=your_production_jwt_secret
   
   # Database setup on production server
   npm run setup
   ```

2. **Deploy options**:
   - **Heroku**: Add MySQL addon and deploy
   - **AWS EC2**: Install Node.js, MySQL, and deploy
   - **Azure App Service**: Connect to Azure Database for MySQL
   - **DigitalOcean App Platform**: With managed MySQL

### Environment Variables for Production

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_PORT=3306
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=elite_properties
JWT_SECRET=your_super_secure_production_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend
Update API base URL in your frontend code to point to production backend.

## 📚 API Documentation

The backend provides a comprehensive REST API. Here are the main endpoints:

### Base URL
```
Production: https://your-api-domain.com/api
Development: http://localhost:5000/api
```

### Authentication Endpoints
```
POST /api/auth/register     # Register new broker
POST /api/auth/login        # Broker login
POST /api/auth/logout       # Logout and invalidate token
GET  /api/auth/profile      # Get current broker profile
PUT  /api/auth/profile      # Update broker profile
```

### Property Endpoints
```
GET    /api/properties              # Get all properties (with filtering)
GET    /api/properties/featured     # Get featured properties
GET    /api/properties/:id          # Get property by ID
POST   /api/properties              # Create new property (auth required)
PUT    /api/properties/:id          # Update property (auth required)
DELETE /api/properties/:id          # Delete property (auth required)
POST   /api/properties/:id/images   # Upload property images
```

### Booking Endpoints
```
GET    /api/bookings                # Get all bookings (auth required)
GET    /api/bookings/:id            # Get booking by ID
POST   /api/bookings                # Create new booking
PUT    /api/bookings/:id            # Update booking (auth required)
PATCH  /api/bookings/:id/status     # Update booking status
DELETE /api/bookings/:id            # Delete booking (auth required)
```

### Query Parameters Example
```
GET /api/properties?type=house&status=available&minPrice=100000&maxPrice=500000&bedrooms=3&location=Austin&sortBy=price&sortOrder=asc&page=1&limit=10
```

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Response data */ },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

For complete API documentation, see `backend/README.md`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary to Elite Properties.

---

**Elite Properties** - *Your gateway to premium real estate*
