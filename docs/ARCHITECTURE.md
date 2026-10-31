# Architecture

The repository contains two independent applications:

- `frontend/` is a React SPA built with Vite. Its screens are in `src/pages`, shared UI is in `src/components`, page shells are in `src/layouts`, auth-aware navigation is in `src/routes`, and service modules own Fastor/Firebase requests.
- `backend/` is an Express REST API. Routes apply validation and authentication middleware, controllers implement request workflows, Mongoose models define persisted data, and `config/db.js` owns the MongoDB connection.

The frontend is the Fastor restaurant assignment; the backend is the independent CRM assignment. The frontend does not use CRM endpoints or CRM tokens.

## Frontend request flow

1. `VITE_AUTH_MODE` selects the login provider; assignment mode is the local default.
2. The selected provider creates a local browser session containing a JWT and user object.
3. Protected React Router routes require a token saved for the active provider.
4. Axios applies `VITE_API_BASE_URL`, a request timeout, a bearer token, and readable API/network errors.
5. Restaurant listing and details use only the documented Fastor restaurant endpoint and its returned fields.

Assignment mode targets the provided staging API origin, `https://staging.fastor.ai`, through `VITE_API_BASE_URL`. If the value is blank or malformed, the Axios request interceptor reports a configuration error rather than accidentally calling Vite at `localhost:5173`.

## Backend request flow

Express routes validate request fields before invoking controllers. JWT middleware verifies the token and resolves its employee. Controllers call Mongoose models and return the shared success/error response shape. A final error middleware handles malformed JSON, validation, invalid IDs, and unexpected errors.
