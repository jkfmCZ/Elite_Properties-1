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

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Elite_Properties
   ```

2. **Setup Backend**:
   - Navigate to the `backend` directory: `cd backend`
   - Install dependencies: `npm install`
   - Create and configure your `.env` file by copying `.env.example`.
   - Setup the database: `npm run setup`
   - Create test user passwords: `node src/scripts/createTestPasswords.js`
   - Start the backend server: `npm run dev`

3. **Setup Frontend**:
   - In a new terminal, navigate to the `client` directory: `cd client`
   - Install dependencies: `npm install`
   - Start the frontend development server: `npm run dev`

4. **Access the application**:
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000`

For more detailed instructions, see the `QUICK_START.md` file.

### Available Scripts

A list of available scripts can be found in `DEV_COMMANDS.md`.

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

## 📚 Documentation

- **[Backend Documentation](backend/README.md)**: Detailed information about the backend API, including endpoints, authentication, and database schema.
- **[Database Setup](backend/DATABASE_SETUP.md)**: Instructions for setting up and configuring the MySQL database.
- **[Admin Panel Guide](ADMIN_PANEL_README.md)**: A guide to using the admin panel for property management.
- **[Development Commands](DEV_COMMANDS.md)**: A list of useful commands for development.

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
