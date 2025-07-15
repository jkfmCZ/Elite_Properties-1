# Elite Properties Development Commands

## Backend Commands
```bash
# Navigate to backend FIRST, then run the command in the SAME terminal
cd backend
npm run dev        # Start with nodemon (auto-restart) - THIS IS THE CORRECT ONE

# Available scripts (from package.json):
npm run start      # Start production server
npm run setup      # Setup database with schema and sample data
npm run setup-dev  # Install dependencies + setup database
npm run migrate    # Run database migrations
npm run test       # Run tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## ⚠️ CRITICAL MISTAKE TO AVOID
**COPILOT: STOP OPENING NEW TERMINALS!**
- When you use `run_in_terminal` with `isBackground=true`, you create a NEW terminal
- When you use `run_in_terminal` with `isBackground=false`, you use the CURRENT terminal
- Always use `isBackground=false` to stay in the same terminal session
- Only use `isBackground=true` for long-running processes like servers

**DO NOT** navigate to backend in one terminal and then run npm commands in a different terminal!
Always ensure you're in the correct directory before running npm commands.

## Frontend Commands
```bash
# Navigate to frontend
cd client

# Available scripts (from package.json):
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint

# Most common for development:
npm run dev
```

## Common Development Workflow
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

## URLs
- Frontend: http://127.0.0.1:5173/ or http://localhost:5173/
- Backend API: http://localhost:5000/api
- Backend Health: http://localhost:5000/health

## Notes
- Backend runs on port 5000
- Frontend runs on port 5173
- Backend has auto-restart with nodemon when using `npm run dev`
- Frontend has hot reload with Vite
