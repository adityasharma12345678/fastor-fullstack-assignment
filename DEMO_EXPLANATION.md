# Firebase Phone Auth Demo

## What this demo does

The app uses Firebase Authentication's Phone provider to send a real SMS OTP to a valid international phone number, verify that OTP, persist the Firebase-authenticated browser session, and navigate to the Restaurant Listing route.

Real SMS requires the developer's own Firebase project, enabled Phone provider, authorized domain, and Firebase configuration in `frontend/.env`. This project does not fabricate Firebase credentials or simulate a real SMS.

## How OTP works

1. The signup form accepts either a national number with a selected calling code or a complete E.164 number beginning with `+`.
2. `toE164PhoneNumber` normalizes whitespace and punctuation and produces the international number sent to Firebase.
3. Firebase Auth creates and checks an invisible reCAPTCHA challenge, then `signInWithPhoneNumber` asks Google's Firebase service to deliver the SMS. The client never creates the verification code.
4. On the OTP screen, the user types the code received on their phone.
5. `confirmationResult.confirm(code)` sends that code to Firebase for verification. Invalid and expired codes are reported to the user.

Firebase enforces SMS delivery limits, phone-region support, and anti-abuse controls. A valid number cannot guarantee delivery if Firebase blocks the request, the project quota is exhausted, or the project is not configured.

## How the user session is created

After Firebase confirms the code, the SDK returns an authenticated Firebase `User`. The app requests the user's Firebase ID token with `user.getIdToken()`, and stores that token and a normalized user object in browser `localStorage`. Firebase Auth also uses `browserLocalPersistence` so its signed-in state survives reloads. A provider tag prevents an assignment-mode token from being reused as a Firebase session or vice versa.

The OTP is not stored. Firebase owns the verification and account identity; this application only stores the resulting authenticated session data.

## Why Firebase was used

The assignment's Fastor flow accepts a fixed OTP and depends on a Fastor API host that was not included in the provided materials. Firebase Phone Auth is a real phone verification provider, so it enables a local demo with actual SMS delivery after a developer configures a Firebase project. The documented Fastor assignment mode remains available separately.

## Restaurant API boundary

Successful Firebase verification redirects to `/restaurants`, fulfilling the demo auth flow. Firebase ID tokens are not Fastor-issued JWTs. The Fastor restaurant endpoint rejects/does not recognize that provider token, so the listing presents an explicit API-boundary message rather than inventing restaurant data. Set `VITE_AUTH_MODE=assignment` and configure `VITE_API_BASE_URL` to use the Fastor API.

## Run it

Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to configure the project and run commands. The short version:

```powershell
cd C:\RN\fastor-fullstack-assignment\frontend
npm install
npm run dev
```
