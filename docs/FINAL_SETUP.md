# Final Setup

Commands below use Windows PowerShell. Replace `C:\RN\fastor-fullstack-assignment` if the repository is checked out elsewhere.

## 1. Install dependencies

```powershell
cd C:\RN\fastor-fullstack-assignment\frontend
npm install

cd C:\RN\fastor-fullstack-assignment\backend
npm install
```

## 2. Configure and run MongoDB and the CRM backend

Start a local MongoDB service or, if Docker Desktop is installed, start MongoDB with:

```powershell
docker run --name fastor-mongo --publish 27017:27017 --volume fastor-mongo-data:/data/db --detach mongo:7
```

If that named container already exists, use `docker start fastor-mongo` instead. Configure the backend and start it:

```powershell
cd C:\RN\fastor-fullstack-assignment\backend
Copy-Item .env.example .env -Force
npm run dev
```

The example config uses `mongodb://127.0.0.1:27017/fastor_crm` and a clearly marked `JWT_SECRET` placeholder. Replace it with a randomly generated private value before using the CRM API outside local development. The API listens on `http://localhost:5000` after it connects to MongoDB.

## 3. Configure and run Fastor assignment mode (default)

In another PowerShell terminal:

```powershell
cd C:\RN\fastor-fullstack-assignment\frontend
Copy-Item .env.example .env -Force
notepad .env
```

Keep assignment mode selected and use the provided Fastor staging API host:

```dotenv
VITE_AUTH_MODE=assignment
VITE_API_BASE_URL=https://staging.fastor.ai
```

Do not substitute `http://localhost:5173`; it is the Vite frontend server, not the Fastor API. Save the file, then start the frontend:

```powershell
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). Register with a phone number, enter the assignment OTP `123456`, and continue to the restaurant list. The frontend uses the token from Fastor login for the restaurant API.

## 4. Run the optional Firebase demo mode

Configure a Firebase Web app, enable **Authentication → Phone**, and authorize `localhost`. In `frontend/.env`, set:

```dotenv
VITE_AUTH_MODE=firebase
VITE_FIREBASE_API_KEY=<Firebase Web app API key>
VITE_FIREBASE_AUTH_DOMAIN=<Firebase auth domain>
VITE_FIREBASE_PROJECT_ID=<Firebase project ID>
VITE_FIREBASE_APP_ID=<Firebase Web app ID>
VITE_FIREBASE_MESSAGING_SENDER_ID=<Firebase messaging sender ID>
```

Restart Vite after changing environment values. This mode sends a real SMS through Firebase after configuration; its Firebase ID token does not authenticate to Fastor's restaurant endpoint. See [FIREBASE_SETUP.md](../FIREBASE_SETUP.md).

## 5. Verify the project

```powershell
cd C:\RN\fastor-fullstack-assignment\frontend
npm run lint
npm run build

cd C:\RN\fastor-fullstack-assignment\backend
npm test
```

The CRM server itself also needs a reachable MongoDB instance. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) if startup or API calls fail.
