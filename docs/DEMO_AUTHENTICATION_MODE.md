# Firebase Demo Authentication Mode

Firebase mode sends a real SMS using Firebase Authentication's Phone provider. It does not provide a fake OTP or bypass reCAPTCHA.

## Firebase project setup

1. Create/select a Firebase project and register a Web app.
2. In Firebase Console, enable **Authentication → Sign-in method → Phone**.
3. Add `localhost` to **Authentication → Settings → Authorized domains** if it is not already present.
4. Copy the Web app config values to `frontend/.env`: API key, auth domain, project ID, app ID, and messaging sender ID.
5. Set `VITE_AUTH_MODE=firebase` and restart the frontend.
6. Enter a national number with its selected country code, or a full international number beginning with `+`. Complete the reCAPTCHA challenge if prompted and enter the SMS code.

The Firebase Web API key is part of the browser config, not a server secret. Apply Firebase API-key restrictions and authorized-domain controls in the Firebase/Google Cloud consoles for deployed applications.

Firebase has SMS quotas and abuse protections; a phone sign-in can fail if the project/provider is not configured, the domain is not authorized, or the quota is exceeded. Errors are shown in the signup/verification flow.

## Session and API boundary

After Firebase verifies the SMS, the client stores the Firebase ID token and verified user in local storage and protects restaurant routes using that mode-tagged session. That token is not a Fastor-issued JWT. Consequently, the restaurant API is deliberately not called in Firebase mode and the UI explains that Fastor data requires assignment mode; no sample restaurant/menu responses are invented.

The CRM backend also has its own employee JWT and does not accept Firebase ID tokens. Use the backend's `/api/auth` endpoints for CRM employees.
