# Fastor Full Stack Assignment

A responsive restaurant discovery experience using Fastor's provided APIs in the local default mode, alongside a separate Firebase phone-auth demo and a CRM lead-management REST API. The frontend consumes only the documented Fastor endpoints in assignment mode; the backend implements the employee-owned enquiry workflow from the Node.js assignment.

## Project Overview

- **Fastor frontend:** phone registration, OTP login, authenticated restaurant browsing, search, alphabetical sorting, and API-backed restaurant details.
- **CRM backend:** employee registration/login and public lead submission, with authenticated public-lead discovery, atomic claiming, and private employee-owned leads.
- The frontend and CRM backend are separate deliverables. The restaurant UI does not call the CRM API.

## Assignment Summary

The React assignment implements the Fastor signup, fixed-OTP login, restaurant listing, and restaurant-detail flow using the supplied API contract and staging host. It does not invent menu or pricing data. The Node.js assignment is implemented as an independent CRM REST API where new enquiries are publicly claimable by employees, but only one employee can atomically claim each lead.

## Frontend Technologies

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, Tailwind CSS, React Router DOM, Axios |
| Optional demo | Firebase Phone Authentication |

## Backend Technologies

Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator, dotenv, and cors.

## Folder Structure

```text
fastor-fullstack-assignment/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── validations/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AUTHENTICATION_FLOW.md
│   ├── API_USAGE.md
│   ├── BACKEND_CRM_DESIGN.md
│   ├── DEMO_AUTHENTICATION_MODE.md
│   ├── TROUBLESHOOTING.md
│   ├── FINAL_SETUP.md
│   └── SUBMISSION_NOTES.md
├── FINAL_SETUP.md
├── BACKEND_CONNECTION_TROUBLESHOOTING.md
├── FIREBASE_SETUP.md
├── DEMO_EXPLANATION.md
├── .gitignore
└── README.md
```

Page-level React hooks, route guards, and express-validator route chains keep this small assignment free of unnecessary wrappers.

## Frontend Setup

Requirements: Node.js 20.19+ and npm. The local `frontend/.env` defaults to assignment mode and uses `https://staging.fastor.ai`. Vite reads `.env` at startup/build time; restart the dev server after changing values.

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Build and lint with:

```powershell
npm run build
npm run lint
```

### Frontend Routes

| Route | Screen | Access |
|---|---|---|
| `/` | Phone signup | Public |
| `/otp` | OTP verification | Public; requires a pending signup |
| `/restaurants` | Restaurant listing | Requires a session for the active auth mode |
| `/restaurants/:id` | Restaurant details | Requires a session for the active auth mode |
| `/404` | Not found | Public |

## Backend Setup

Requirements: Node.js 20+ and a reachable MongoDB instance (local or hosted).

```powershell
cd backend
npm install
Copy-Item .env.example .env -Force
```

The local `backend/.env` uses a local MongoDB URL and a development-only JWT secret. For the example Atlas connection format, use [BACKEND_CONNECTION_TROUBLESHOOTING.md](./BACKEND_CONNECTION_TROUBLESHOOTING.md), and replace the JWT secret before deployment. Start a local MongoDB service (or use a hosted URI), then run:

```powershell
npm run dev
```

The API listens on `http://localhost:5000` by default. `npm start` runs the same server without nodemon. The server validates required configuration and connects to MongoDB before accepting requests.

Run the backend's database-independent controller tests with:

```powershell
npm test
```

## Environment Variables

### `frontend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_AUTH_MODE` | No | `assignment` | `assignment` uses Fastor register/login APIs and fixed `123456` OTP; `firebase` is a separate real-SMS demo. Restart Vite after changing it. |
| `VITE_API_BASE_URL` | No | `https://staging.fastor.ai` | Fastor API origin, without a trailing slash. |
| `VITE_FIREBASE_API_KEY` | Firebase mode | — | Firebase Web app API key. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase mode | — | Firebase Web app auth domain. |
| `VITE_FIREBASE_PROJECT_ID` | Firebase mode | — | Firebase project ID. |
| `VITE_FIREBASE_APP_ID` | Firebase mode | — | Firebase Web app ID. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase mode | — | Firebase project messaging sender ID. |

### `backend/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Express listening port. |
| `MONGODB_URI` | Yes | `mongodb://127.0.0.1:27017/fastor_crm` | MongoDB connection string. Atlas SRV and standard seed-list formats are supported. |
| `MONGODB_DNS_SERVERS` | No | System resolver | Optional comma-separated DNS server IPs for SRV lookup if the system resolver refuses it. |
| `MONGODB_SERVER_SELECTION_TIMEOUT_MS` | No | `10000` | Positive integer timeout for server selection. |
| `JWT_SECRET` | Yes | Local-only placeholder | Private signing secret of at least 32 characters. Replace it for local/private use and keep it out of source control. |
| `JWT_EXPIRES_IN` | No | `1d` | `jsonwebtoken` token lifetime, such as `12h` or `7d`. |
| `CORS_ORIGIN` | No | Any origin | Comma-separated allowed browser origins. Set this to the deployed frontend origin(s) in production. |

## API Documentation

CRM endpoints use JSON. Successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "message": "..." }`. Validation failures can also include an `errors` array with field-level details. Protected endpoints require `Authorization: Bearer <token>`.

### Authentication

#### `POST /api/auth/register`

Creates an employee, hashes the password, and returns a JWT.

```json
{
  "name": "Asha Patel",
  "email": "asha@example.com",
  "password": "secure-pass-123"
}
```

Returns `201` with `{ "employee": { "id", "name", "email", "createdAt", "updatedAt" }, "token" }`.

#### `POST /api/auth/login`

```json
{
  "email": "asha@example.com",
  "password": "secure-pass-123"
}
```

Returns `200` with the public employee fields and a signed JWT. Invalid credentials return `401`.

### Leads

#### `POST /api/leads` — public

Creates an enquiry. Required fields: `name`, `email`, `phone`, and `courseInterest`.

```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "phone": "+91 9876543210",
  "courseInterest": "Data Analytics"
}
```

Returns `201` with the new unclaimed lead.

#### `GET /api/leads/unclaimed` — JWT required

Returns all currently public enquiries, oldest first. Claimed leads are excluded.

#### `POST /api/leads/:id/claim` — JWT required

Atomically assigns an unclaimed lead to the authenticated employee. Returns `200` and the assigned lead to the first successful claimant; returns `409` if another employee has already claimed it and `404` if the lead does not exist.

#### `GET /api/leads/my-leads` — JWT required

Returns only leads assigned to the authenticated employee.

## Authentication Flow

`VITE_AUTH_MODE=assignment` is the local default. It uses the provided Fastor endpoints at `https://staging.fastor.ai` and the assignment's fixed `123456` OTP. `VITE_AUTH_MODE=firebase` selects the separate real-SMS demo, which requires Firebase configuration and Firebase Console setup.

The Firebase ID token is not accepted by Fastor's restaurant API or the CRM backend. Firebase mode demonstrates phone verification and local route authentication; restaurant data requires a Fastor-issued JWT in assignment mode. See [docs/DEMO_AUTHENTICATION_MODE.md](./docs/DEMO_AUTHENTICATION_MODE.md).

CRM employees authenticate independently through the backend auth endpoints. CRM tokens are not interchangeable with Fastor tokens.

## CRM Lead Claim Flow

- New leads default to `claimed: false` and `claimedBy: null`, making them public to authenticated employees.
- Claiming uses a single MongoDB `findOneAndUpdate` filtered by both the lead ID and `claimed: false`. MongoDB's atomic update means concurrent claim attempts cannot both succeed.
- A successful claim sets `claimed: true` and `claimedBy` to the authenticated employee ID.
- The public queue filters for `claimed: false`; the private queue filters for the logged-in employee's `claimedBy` ID.

## Assumptions

- Assignment mode uses the staging API origin specified for this final audit: `https://staging.fastor.ai`.
- Firebase Phone Auth requires a configured Firebase Web app and authorized localhost domain; no Firebase project credentials are fabricated.
- The provided OTP is fixed at `123456` in assignment mode only.
- The restaurant listing endpoint is the only source of restaurant data. Detail routes reuse its documented city listing to resolve a restaurant after direct navigation or refresh.
- Since restaurant responses do not include menu, food, rating, price, or ordering data, the detail screen presents only the available logo, name, address, and restaurant ID.
- The CRM API and restaurant frontend are intentionally separate because the assignments describe different authentication systems and business domains.

## Technical Decisions

- React hooks and browser storage are sufficient for the frontend session and listing state; no global state library is needed.
- Axios centralizes the API base URL, bearer-token injection, request timeout, and readable network/API errors.
- Authentication screens use a restrained orange-and-cream visual system, with responsive layouts adapted from the supplied mobile Figma reference.
- Backend routes, controllers, models, and middleware separate HTTP concerns, data operations, and cross-cutting validation/authentication.
- Lead ownership is enforced in MongoDB query filters, not only in application-level checks.
- Unique employee email and lead-queue indexes support expected lookup patterns; MongoDB timestamps populate `createdAt` and `updatedAt`.

## Future Improvements

- Add automated integration tests against an ephemeral MongoDB replica set, including concurrent claim requests.
- Add pagination for large public and employee lead queues.
- Add deployment-specific secret management, structured logging, rate limiting, and monitoring.
- Add environment-specific API origins for deployment targets beyond the supplied staging environment.
- Add design review screenshots after running against valid Fastor API credentials/responses.

## Screenshots

The UI follows the supplied Figma signup and OTP screens and adapts the restaurant screens to the documented API data. No static screenshots are included; capture the running UI at mobile and desktop widths when reviewing locally.

## Author

Aditya Sharma

## Setup and design notes

- [Final setup commands](./FINAL_SETUP.md)
- [Detailed setup](./docs/FINAL_SETUP.md)
- [Firebase setup](./FIREBASE_SETUP.md)
- [Demo explanation](./DEMO_EXPLANATION.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Authentication flow](./docs/AUTHENTICATION_FLOW.md)
- [API usage](./docs/API_USAGE.md)
- [Backend CRM design](./docs/BACKEND_CRM_DESIGN.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Backend MongoDB connection troubleshooting](./BACKEND_CONNECTION_TROUBLESHOOTING.md)
- [Submission notes](./docs/SUBMISSION_NOTES.md)
