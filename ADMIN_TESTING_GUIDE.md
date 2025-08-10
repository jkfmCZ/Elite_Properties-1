# Elite Properties Admin Panel - Testing Guide

## Quick Setup & Testing

### 1. Backend Setup
```bash
cd backend
npm install
npm run setup-dev
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Testing the Admin Panel

#### Step 1: Login
- Navigate to `http://localhost:5173/login`
- Use test credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

#### Step 2: Access Admin Dashboard
- After login, navigate to admin section
- You should see:
  - Dashboard overview with statistics
  - Property management interface
  - Analytics section
  - Settings panel

#### Step 3: Test Property Management

**Adding a Property:**
1. Click "Add Property" button
2. Fill in required fields:
   - Title: "Test Modern House"
   - Description: "Beautiful test property"
   - Price: 500000
   - Location: "123 Test Street"
   - City: "Austin"
   - State: "TX"
   - Property Type: House
   - Bedrooms: 3
   - Bathrooms: 2
   - Square Footage: 2000
3. Add optional fields:
   - Lot Size: 5000
   - Year Built: 2020
   - Features: "hardwood floors", "modern kitchen"
   - Amenities: "pool", "garage"
4. Click "Create Property"

**Editing a Property:**
1. Find the property in the grid
2. Click the edit (pencil) icon
3. Modify any fields
4. Click "Update Property"

**Deleting a Property:**
1. Find the property in the grid
2. Click the delete (trash) icon
3. Confirm deletion in the dialog

**Search & Filter:**
1. Use the search bar to find properties by title/location
2. Filter by status (Available, Pending, Sold)
3. Filter by property type (House, Apartment, etc.)

### 4. Backend API Endpoints Used

The admin panel integrates with these backend endpoints:

- `POST /api/auth/login` - Authentication
- `GET /api/properties/dashboard/my-properties` - Fetch properties
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### 5. Expected Functionality

✅ **Working Features:**
- JWT authentication with secure login
- Real-time dashboard statistics
- Complete property CRUD operations
- Search and filtering
- Responsive design with dark mode
- Form validation and error handling
- Image URL preview
- Dynamic features and amenities management

✅ **Admin Dashboard Tabs:**
- Overview: Statistics and quick actions
- Properties: Full property management
- Analytics: Property performance metrics
- Settings: Account info and logout

### 6. Troubleshooting

**Common Issues:**

1. **"Failed to load properties"**
   - Ensure backend server is running on port 5000
   - Check if logged in with valid broker credentials
   - Verify database connection

2. **Login fails**
   - Ensure test broker exists in database
   - Run database setup: `npm run setup-dev`
   - Check console for authentication errors

3. **Form submission fails**
   - Check required fields are filled
   - Verify backend API is accessible
   - Check browser network tab for API errors

### 7. Development Notes

**Key Files:**
- `AdminDashboard.tsx` - Main dashboard with tabs
- `PropertyManagement.tsx` - Property listing and management
- `PropertyForm.tsx` - Add/edit property form

**Backend Integration:**
- Uses fetch API with JWT tokens
- Handles all CRUD operations
- Includes error handling and user feedback

**UI Components:**
- Built with Radix UI components
- Styled with Tailwind CSS
- Icons from Tabler Icons
- Animations with Framer Motion

### 8. Production Checklist

Before deploying:
- [ ] Test all CRUD operations
- [ ] Verify authentication flow
- [ ] Test responsive design
- [ ] Check error handling
- [ ] Validate form submissions
- [ ] Test search and filtering
- [ ] Verify image uploads work
- [ ] Check data persistence
