import { getAuthMode } from '../services/authMode.js'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const MODE_KEY = 'auth_mode'

function isSessionForCurrentMode() {
  const storedMode = localStorage.getItem(MODE_KEY) || 'assignment'
  return storedMode === getAuthMode()
}

export function getToken() {
  return isSessionForCurrentMode() ? localStorage.getItem(TOKEN_KEY) : null
}

export function getUser() {
  try {
    if (!isSessionForCurrentMode()) return null
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Unable to read saved user session', error)
    return null
  }
}

export function saveSession(token, user, mode = getAuthMode()) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(MODE_KEY, mode)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(MODE_KEY)
}
