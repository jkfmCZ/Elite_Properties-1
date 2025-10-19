# Minimum Viable Product (MVP): Elite Properties

A focused, testable slice of Elite Properties to validate core value: browsing premium properties, viewing details, making booking inquiries, and enabling brokers to authenticate and post a listing. This MVP uses the existing React/TypeScript frontend and Node/Express/MySQL backend.

## Goals
- Visitors can browse properties and view details with images.
- Visitors can submit a simple booking inquiry (stored server-side in-memory for now).
- Brokers can log in and create a property.
- App runs locally with a seeded MySQL database for properties/brokers.

## Non‑Goals (Deferred)
- Full admin panel and authorization matrix beyond broker auth.
- Persistent bookings in DB (MVP uses in-memory store).
- Advanced search facets and market insights visualizations.
- File storage service (S3, CDN); local uploads only if needed.

## User Roles and Core Flows
- Visitor
  - Browse listings: GET /api/properties
  - View property details: GET /api/properties/:id
  - Submit booking inquiry: POST /api/bookings
- Broker
  - Login: POST /api/auth/login (token returned)
  - View profile: GET /api/auth/profile (Authorization: Bearer <token>)
  - Create property: POST /api/properties (Authorization: Bearer <token>)
  - View my properties: GET /api/properties/dashboard/my-properties (Authorization)

## API Endpoints in Scope
- Health and Index
  - GET /health → 200, service OK
  - GET /api → lists API sections
- Auth (backend/src/routes/auth.js)
  - POST /api/auth/login
  - GET /api/auth/profile (auth required)
- Properties (backend/src/routes/properties.js)
  - GET /api/properties
  - GET /api/properties/:id
  - POST /api/properties (auth required)
  - GET /api/properties/dashboard/my-properties (auth required)
- Bookings (temporary in-memory; backend/src/controllers/bookingController.js)
  - POST /api/bookings (create)
  - GET /api/bookings (list) — for manual verification

Notes
- Uploads: /api/properties/upload routes exist; they are optional for MVP and can be used for local image tests.

## Frontend Scope (client)
- Pages: Properties list, Property detail, Login, Basic broker view, Booking form (from details or a simple page).
- Client uses VITE API URL: VITE_API_URL defaults to http://localhost:5000/api.

## Acceptance Criteria
1) Backend readiness
- GET http://localhost:5000/health returns JSON { success: true, ... }.
- GET http://localhost:5000/api returns success with endpoints list.

2) Properties
- GET /api/properties returns an array of properties (>= 1 after seed), each with id/uuid, title/name, price, address/location, and at least one image URL.
- GET /api/properties/:id returns a single property matching the ID.

3) Booking inquiry
- POST /api/bookings with body { clientName, clientEmail, clientPhone, propertyId? } returns 201 and echoes created booking with status "pending".
- GET /api/bookings returns an array including the newly created booking for the session (note: in-memory, not persisted across server restarts).

4) Broker authentication and property creation
- POST /api/auth/login with seeded credentials returns { accessToken, refreshToken, broker }.
- GET /api/auth/profile with Bearer token returns the broker’s profile.
- POST /api/properties with Bearer token and minimal body creates a property and returns 201.
- GET /api/properties/dashboard/my-properties returns at least the created property for that broker.

5) Frontend UX
- Visiting http://localhost:5173 shows a list of properties.
- Clicking a property navigates to a details page with image(s) and key facts.
- A booking form (modal or section) validates required fields and calls POST /api/bookings; user receives success feedback.
- A login page posts to /api/auth/login and stores token in localStorage (client already attaches Authorization if token is present).

## Data and Environment
- DB: MySQL 8+; schema and seed via backend scripts.
- Env: backend/.env from .env.example; ensure JWT values set.
- Frontend: optional .env with VITE_API_URL=http://localhost:5000/api if you customized ports.

## How to Run (Windows PowerShell)
1) Backend
```powershell
cd backend
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
# Edit .env for MySQL credentials and JWT_* values
npm run setup
node src/scripts/createTestPasswords.js
npm run dev
```
- Health check: http://localhost:5000/health

2) Frontend (new terminal)
```powershell
cd client
npm install
npm run dev
```
- Open http://localhost:5173

Seeded Test Accounts (from README)
- john.smith@eliteproperties.com / password123 (Broker)
- sarah.johnson@eliteproperties.com / password123 (Broker)
- admin@eliteproperties.com / admin123 (Admin)

## Smoke Test Checklist
Backend
- [ ] GET /health → 200 with success
- [ ] GET /api → lists endpoints
- [ ] GET /api/properties → array length ≥ 1
- [ ] GET /api/properties/:id → returns object
- [ ] POST /api/bookings → 201, status "pending"
- [ ] POST /api/auth/login → tokens returned
- [ ] GET /api/auth/profile (Bearer) → profile returned
- [ ] POST /api/properties (Bearer) → 201 created

Frontend
- [ ] Properties list renders cards
- [ ] Detail page opens with images
- [ ] Booking form submits and shows success state
- [ ] Login works and persists token; protected calls succeed

## Known Limitations in MVP
- Bookings are not persisted to MySQL (in-memory store in BookingController).
- Image uploads are local-only; no cloud storage.
- Error states and loading skeletons are minimal.
- Advanced filtering and analytics deferred.

## Next Steps (Post-MVP)
- Persist bookings in DB tables with status transitions and notifications.
- Robust property search (price, beds, area, city, tags) with server-side filters/pagination.
- Admin panel for property review, broker management, and audit logs.
- Image management: upload, multiple sizes, cloud storage (S3 or similar).
- E2E tests (Playwright) for key user flows and API contract tests.
- CI: lint, typecheck, test on PRs; seed ephemeral DB for preview.
