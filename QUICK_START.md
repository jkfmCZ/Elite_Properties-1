# Elite Properties - Quick Start Guide

Get the Elite Properties real estate application running in 5 minutes! 🚀

## Prerequisites

Install these first:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MySQL 8.0+** - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download here](https://git-scm.com/)

## Option 1: Full Stack Setup (Recommended)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd Elite_Properties

# Backend setup
cd backend
npm install
copy .env.example .env

# Frontend setup (new terminal)
cd ../client
npm install
```

### 2. Configure Database
Edit `backend/.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=elite_properties
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Setup & Run
```bash
# In backend directory
npm run setup     # Creates database & tables
npm run dev       # Starts backend (port 5000)

# In client directory (new terminal)
npm run dev       # Starts frontend (port 5173)
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## Option 2: Frontend Only (No Database)

Perfect for UI development and testing:

```bash
cd client
npm install
npm run dev
```

Frontend runs with mock data at http://localhost:5173

## Project Structure

```
Elite_Properties/
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── scripts/
│   └── database/      # SQL schema & migrations
├── client/            # React/TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── public/
└── docs/
```

## Key Features

- 🏠 **Property Listings** - Browse premium real estate
- 🔍 **Advanced Search** - Filter by price, type, location
- 💬 **AI Chat Assistant** - Get instant property help
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Broker Dashboard** - Property management system
- 📅 **Booking System** - Schedule property viewings

## Common Commands

```bash
# Backend
npm run dev          # Start development server
npm run setup        # Setup database
npm run migrate      # Run database migrations

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Check credentials in `backend/.env`
3. Create database manually: `CREATE DATABASE elite_properties;`

### Port Already in Use
```bash
# Kill process on port
npx kill-port 5000    # Backend
npx kill-port 5173    # Frontend
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

1. **Backend**: Make API changes in `backend/src/`
2. **Frontend**: Update UI in `client/src/components/`
3. **Database**: Add migrations in `backend/database/migrations/`
4. **Types**: Update TypeScript types in `client/src/types/`

## Need Help?

- 📖 **Full Documentation**: See main `README.md`
- 🗄️ **Database Setup**: See `backend/DATABASE_SETUP.md`
- 🎨 **Admin Panel**: See `ADMIN_PANEL_README.md`
- 🛠️ **Dev Commands**: See `DEV_COMMANDS.md`

---

**Ready to build amazing real estate experiences!** 🏡✨
