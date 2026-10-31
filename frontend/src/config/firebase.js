import { getApp, getApps, initializeApp } from '@firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from '@firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

export async function getFirebaseAuth() {
  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length) {
    throw new Error(
      `Firebase Phone Auth is not configured. Set ${missing.join(', ')} in frontend/.env.`,
    )
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const auth = getAuth(app)
  await setPersistence(auth, browserLocalPersistence)
  return auth
}
