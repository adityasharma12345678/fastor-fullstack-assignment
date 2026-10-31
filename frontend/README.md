# Fastor Frontend

The React/Vite frontend for the Fastor restaurant assignment. See the [root README](../README.md) for the project overview, API documentation, and assignment details.

## Run locally

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The example selects Fastor assignment mode and uses `https://staging.fastor.ai`. For the optional Firebase Phone Auth demo, set `VITE_AUTH_MODE=firebase`, configure the Firebase values in `.env`, then restart Vite.

## Checks

```powershell
npm run lint
npm run build
```
