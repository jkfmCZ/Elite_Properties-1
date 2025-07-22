# Admin Panel for Elite Properties

## Overview

The admin panel allows brokers to manage their property listings with full CRUD operations (Create, Read, Update, Delete). The panel includes authentication, dashboard overview, and comprehensive property management features.

## Features

### Authentication
- Secure JWT-based login system
- Role-based access (broker/admin permissions)
- Session management with automatic logout
- Protected routes

### Dashboard
- Property statistics overview
- Quick action buttons
- Real-time data display
- Performance metrics

### Property Management
- **Add Properties**: Create new property listings with detailed information
- **Edit Properties**: Update existing property details
- **Delete Properties**: Remove properties (soft delete)
- **View Properties**: Preview properties as they appear to customers
- **Search & Filter**: Find properties by title, location, status, or type
- **Bulk Actions**: Manage multiple properties efficiently

### Property Features
- **Basic Information**: Title, description, price, type, status
- **Location Details**: Address, city, state, ZIP code
- **Property Specs**: Bedrooms, bathrooms, square footage
- **Images**: Main image with preview
- **Features**: Customizable property features (hardwood floors, etc.)
- **Amenities**: Property amenities (pool, gym, etc.)
- **Publishing**: Draft/published status control

## Getting Started

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

### 2. Start the Frontend
```bash
cd client
npm run dev
```

### 3. Login Credentials
Use these test credentials to access the admin panel:

| Email | Password | Role |
|-------|----------|------|
| john.smith@eliteproperties.com | password123 | Broker |
| sarah.johnson@eliteproperties.com | password123 | Broker |
| mike.davis@eliteproperties.com | password123 | Broker |
| admin@eliteproperties.com | admin123 | Admin |

### 4. Setup Database (if needed)
```bash
cd backend
npm run setup
```

## Usage

### Accessing the Admin Panel
1. Navigate to `http://localhost:5173/login`
2. Use one of the test credentials above
3. After successful login, you'll be redirected to the admin dashboard
4. Click "Admin Panel" in the navigation or go directly to `/admin`

### Managing Properties

#### Adding a New Property
1. Go to the admin dashboard
2. Click "Add Property" or navigate to the Properties tab
3. Fill in all required fields:
   - Property title and description
   - Location information
   - Price and property details
   - Property type and status
4. Optionally add:
   - Main image URL
   - Property features
   - Amenities
5. Set publishing status (published properties are visible to the public)
6. Click "Create Property"

#### Editing Properties
1. In the property management section, find the property you want to edit
2. Click the "Edit" button on the property card
3. Modify any fields as needed
4. Click "Update Property" to save changes

#### Deleting Properties
1. Find the property you want to delete
2. Click the trash icon on the property card
3. Confirm the deletion in the dialog
4. The property will be soft-deleted (not permanently removed)

#### Filtering and Searching
- Use the search bar to find properties by title or location
- Filter by status: All, Available, Pending, Sold
- Filter by type: All, House, Apartment, Plot, Commercial

## API Endpoints Used

The admin panel interacts with these backend endpoints:

### Authentication
- `POST /api/auth/login` - Broker login
- `GET /api/auth/profile` - Get current broker profile

### Properties
- `GET /api/properties/dashboard/my-properties` - Get broker's properties
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property (soft delete)

## Architecture

### Frontend Structure
```
client/src/components/admin/
├── AdminDashboard.tsx      # Main dashboard component
├── PropertyManagement.tsx  # Property listing and management
└── PropertyForm.tsx        # Add/edit property form
```

### Key Components
- **AdminDashboard**: Main admin interface with tabs and statistics
- **PropertyManagement**: Grid view of properties with search/filter
- **PropertyForm**: Comprehensive form for adding/editing properties
- **ProtectedRoute**: Authentication wrapper for admin routes

### State Management
- Local state with React hooks
- Local storage for authentication tokens
- Real-time updates after CRUD operations

## Security Features

- JWT token authentication
- Route protection for unauthorized access
- Admin role verification
- Secure API communication
- Session management
- Input validation and sanitization

## Development Notes

### Adding New Features
1. Properties are stored with the following key fields:
   - `uuid`: Unique identifier for public URLs
   - `broker_id`: Links property to the creating broker
   - `published`: Controls public visibility
   - `features`: JSON array of property features
   - `amenities`: JSON array of property amenities

2. The form supports:
   - Real-time validation
   - Image preview
   - Dynamic feature/amenity management
   - Draft saving

### Database Schema
Properties include fields for:
- Basic info (title, description, price)
- Location (address, city, state, zip)
- Specifications (bedrooms, bathrooms, square footage)
- Metadata (type, status, created/updated dates)
- JSON fields (features, amenities)

## Troubleshooting

### Common Issues

1. **"Failed to load properties"**
   - Ensure backend server is running
   - Check if user is properly authenticated
   - Verify database connection

2. **"Access Denied"**
   - Make sure you're logged in
   - Check if using correct credentials
   - Clear browser storage and login again

3. **Form submission errors**
   - Verify all required fields are filled
   - Check network connection
   - Ensure backend API is accessible

### Error Handling
- Toast notifications for user feedback
- Graceful error states in UI
- Loading indicators during operations
- Form validation messages

## Future Enhancements

Planned features for the admin panel:
- Image upload functionality
- Bulk property import/export
- Advanced analytics and reporting
- Property performance tracking
- Customer inquiry management
- Commission tracking
- Market insights dashboard
- Mobile responsive improvements
