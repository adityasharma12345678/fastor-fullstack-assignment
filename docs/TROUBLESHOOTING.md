# Troubleshooting

## 1. Why `localhost:5173` returned 404

`frontend/.env` had an empty `VITE_API_BASE_URL`. Axios therefore resolved the relative `/v1/pwa/user/register` path against the Vite page origin, `http://localhost:5173`. Vite serves the frontend and does not implement Fastor's API routes, so it returned 404.

Assignment mode defaults `VITE_API_BASE_URL` to `https://staging.fastor.ai`. If it is blank or malformed, the Axios request interceptor stops the request and shows a configuration error instead of sending it to the frontend origin. If you change `.env`, restart Vite.

## 2. How assignment mode works

`VITE_AUTH_MODE=assignment` selects the documented Fastor flow:

1. `POST /v1/pwa/user/register` with `phone` and `dial_code`.
2. Enter the assignment's fixed OTP `123456`.
3. `POST /v1/pwa/user/login`; save the returned Fastor token and user.
4. Send the token as a bearer token to `GET /v1/m/restaurant?city_id=118`.
5. Restaurant details use only fields from the restaurant listing response.

Live calls require network access to the staging API and valid provider behavior. The frontend uses only the documented endpoints.

## 3. How Firebase demo mode works

Set `VITE_AUTH_MODE=firebase` and provide the Firebase Web app settings in `frontend/.env`. Firebase Phone Auth uses reCAPTCHA, sends the SMS, and verifies the entered code. The resulting Firebase ID token is saved in a mode-tagged local session. Firebase mode is an optional demo and does not use or replace Fastor assignment authentication. A Firebase ID token is not accepted by the Fastor restaurant API.

## 4. How environment variables are loaded

- Vite loads `frontend/.env` when Vite starts and when it builds. Only variables prefixed with `VITE_` are exposed to browser code. Stop and restart `npm run dev` after editing it.
- Copy `frontend/.env.example` to `frontend/.env` as a starting point. Do not commit `.env` files.
- The backend loads `backend/.env` using a path relative to `backend/server.js`, so it works even when launched from a different current directory.
- `backend/.env.example` provides a local MongoDB URI and a clearly marked JWT secret placeholder. Replace it with a randomly generated secret before using the CRM API; never commit `backend/.env`.

## 5. How JWT authentication works

Fastor login returns a Fastor-issued JWT. The frontend stores it with the user and auth-mode tag, and Axios sends `Authorization: Bearer <token>` on subsequent Fastor requests. Firebase tokens and CRM employee tokens belong to separate authentication systems and must not be interchanged.

The CRM login/register endpoints return a CRM JWT signed with `JWT_SECRET`. Protected lead routes verify it and resolve the employee identity before accessing owned leads.

## 6. How lead claiming works

The backend claims a lead with one MongoDB `findOneAndUpdate` whose filter includes both the lead ID and `claimed: false`. That conditional update is atomic, so only one concurrent employee can claim the lead. A later claimant receives a conflict response; claimed leads no longer appear in the public unclaimed queue.

## Common setup checks

- Verify `VITE_AUTH_MODE` is `assignment` for the company flow.
- Verify `VITE_API_BASE_URL` is an absolute Fastor API origin and restart Vite.
- Verify MongoDB is reachable at `MONGODB_URI` before starting the CRM API.
- Verify `JWT_SECRET` is present and at least 32 characters long.
- Run `npm test` from `backend/`, and `npm run lint` plus `npm run build` from `frontend/`.
