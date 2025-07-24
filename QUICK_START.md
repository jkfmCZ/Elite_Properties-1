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

## Troubleshooting

For more detailed troubleshooting information, see the main `README.md` file.

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
