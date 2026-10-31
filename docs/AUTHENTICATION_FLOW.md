# Authentication Flow

The local `frontend/.env` defaults to Fastor assignment mode. Set `VITE_AUTH_MODE` to exactly one of:

- `assignment`: use Fastor's provided register and login APIs.
- `firebase`: send and verify a real Firebase Phone Auth SMS code.

Restart Vite after changing `.env`; Vite reads environment values at startup/build time. The saved browser session is tagged with the mode that created it, so switching modes does not reuse the previous provider's token.

## Fastor assignment mode

1. Signup sends `{ "phone": "...", "dial_code": "+91" }` to `POST /v1/pwa/user/register` at `https://staging.fastor.ai`. The origin is configurable via `VITE_API_BASE_URL`; an invalid or blank value produces a configuration message rather than falling back to Vite's `localhost:5173`.
2. OTP verification accepts the assignment's fixed code `123456`.
3. Login sends `{ "phone": "...", "otp": "123456", "dial_code": "+91" }` to `POST /v1/pwa/user/login`.
4. The response token and user are saved to local storage and attached as a bearer token to Fastor requests.

## Firebase demo mode

1. Signup accepts a national number with its selected country code or a complete international number beginning with `+`; it normalizes the number to E.164 for Firebase Phone Auth.
2. Firebase reCAPTCHA protects the SMS request. The browser Firebase SDK sends the SMS; no OTP is generated or stored by this application.
3. OTP verification is completed by Firebase's `ConfirmationResult`.
4. The Firebase ID token and a normalized user object are saved to local storage. Firebase browser persistence is enabled.

Firebase's ID token is not a Fastor JWT and is not accepted by the Fastor restaurant service or the CRM backend. Successful Firebase verification still navigates to `/restaurants`; the route explains that real restaurant data requires assignment mode and a Fastor token. No restaurant data is fabricated to conceal that provider boundary.

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for API and environment diagnostics, [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) for console and environment setup, and [DEMO_EXPLANATION.md](../DEMO_EXPLANATION.md) for the full demo flow.
