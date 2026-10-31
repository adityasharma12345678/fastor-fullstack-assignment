# API Usage

## Fastor APIs used by the frontend

The frontend defaults `VITE_API_BASE_URL` to `https://staging.fastor.ai`, the staging host specified for this assignment. Paths and request payloads are kept as supplied:

| Method | Path | Auth | Request |
|---|---|---|---|
| `POST` | `/v1/pwa/user/register` | Public | `{ "phone": "...", "dial_code": "+91" }` |
| `POST` | `/v1/pwa/user/login` | Public | `{ "phone": "...", "otp": "123456", "dial_code": "+91" }` |
| `GET` | `/v1/m/restaurant?city_id=118` | Fastor bearer token | No body |

The restaurant detail page resolves an item from the same documented city listing. It does not call an invented detail endpoint. Menus, prices, ratings, and orders are not present in the API contract and are not displayed as real data. Firebase demo mode intentionally does not send its Firebase ID token to this API; switch to assignment mode for Fastor restaurant data.

## CRM API

The backend runs independently at `http://localhost:5000` by default. It returns `{ "success": true, "data": ... }` on success and `{ "success": false, "message": "..." }` for errors.

| Method | Path | Auth |
|---|---|---|
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `POST` | `/api/leads` | Public |
| `GET` | `/api/leads/unclaimed` | Employee JWT |
| `POST` | `/api/leads/:id/claim` | Employee JWT |
| `GET` | `/api/leads/my-leads` | Employee JWT |

Protected CRM requests use `Authorization: Bearer <employee JWT>`. See the root README for JSON request and response examples.
