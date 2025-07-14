# Elite Properties Backend API

Express.js backend API for the Elite Properties real estate application, written in JavaScript.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   copy .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   **Or start production server:**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Available Endpoints

#### Root Endpoints
- `GET /` - API status and information
- `GET /health` - Health check endpoint

#### Properties
- `GET /api/properties` - Get all properties (with filtering, pagination, sorting)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

#### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

#### Brokers
- `GET /api/brokers` - Get all brokers
- `GET /api/brokers/:id` - Get broker by ID
- `POST /api/brokers` - Create new broker
- `PUT /api/brokers/:id` - Update broker
- `PATCH /api/brokers/:id/availability` - Update broker availability
- `DELETE /api/brokers/:id` - Delete broker

#### Market Insights
- `GET /api/insights` - Get all market insights
- `GET /api/insights/latest` - Get latest insights
- `GET /api/insights/:id` - Get insight by ID
- `POST /api/insights` - Create new insight
- `PUT /api/insights/:id` - Update insight
- `DELETE /api/insights/:id` - Delete insight

#### Chat
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history
- `GET /api/chat/actions` - Get quick actions

### Query Parameters

#### Properties Filtering
```
GET /api/properties?type=house&status=available&minPrice=100000&maxPrice=500000&bedrooms=3&location=Austin
```

Available filters:
- `type`: house, apartment, plot
- `status`: available, sold, pending
- `minPrice`: minimum price
- `maxPrice`: maximum price
- `bedrooms`: minimum number of bedrooms
- `bathrooms`: minimum number of bathrooms
- `location`: location search (partial match)
- `sortBy`: price, bedrooms, squareFootage, createdAt
- `sortOrder`: asc, desc
- `page`: page number (default: 1)
- `limit`: items per page (default: 10)

### Response Format

All API responses follow this format:

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

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with nodemon (auto-restart on changes)
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

### Project Structure

```
backend/
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── indexController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   ├── brokerController.js
│   │   ├── marketInsightController.js
│   │   └── chatController.js
│   ├── data/                 # Mock data (temporary)
│   │   └── mockData.js
│   ├── middleware/           # Express middleware
│   │   ├── index.js
│   │   └── errorHandler.js
│   ├── routes/              # Route definitions
│   │   └── index.js
│   └── app.js               # Express app setup
├── node_modules/            # Dependencies
├── .env                     # Environment variables
├── .env.example            # Environment variables template
├── package.json
└── README.md
```

## 🚀 Testing the API

### Using PowerShell (Windows)
```powershell
# Test root endpoint
Invoke-RestMethod -Uri "http://localhost:5000" -Method Get

# Test properties endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/properties" -Method Get

# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
```

### Using curl
```bash
# Test root endpoint
curl http://localhost:5000

# Test properties endpoint
curl http://localhost:5000/api/properties

# Test health endpoint
curl http://localhost:5000/health
```

## 📱 Frontend Integration

The backend is configured to work with the React frontend running on `http://localhost:5173`. CORS is properly configured to allow requests from the frontend.

To connect your frontend to this backend:

1. Update your frontend API calls to point to `http://localhost:5000/api`
2. Start the backend server (`npm run dev` or `npm start`)
3. Start your frontend development server
4. The frontend can now make API calls to fetch properties, create bookings, etc.

### Example Frontend API Call
```javascript
// Fetch all properties
const response = await fetch('http://localhost:5000/api/properties');
const data = await response.json();
console.log(data.data); // Array of properties

// Create a new booking
const bookingData = {
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  clientPhone: '+1-555-0123',
  preferredDate: '2025-07-20',
  preferredTime: '14:00',
  preferredLocation: 'Property Location',
  message: 'Interested in viewing this property'
};

const response = await fetch('http://localhost:5000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(bookingData)
});
```

## 🚀 Deployment

### Local Production
```bash
npm start
```

### Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔮 Future Database Integration

This backend is currently using mock data but is structured to easily integrate with a database. The controllers are designed to work with any data layer:

### MongoDB Integration (Example)
```bash
npm install mongoose
```

### PostgreSQL Integration (Example)
```bash
npm install pg
```

Simply replace the mock data imports in controllers with database models.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary to Elite Properties.
