const AUTH_MODES = ['assignment', 'firebase']

export function getAuthMode() {
  const mode = import.meta.env.VITE_AUTH_MODE || 'assignment'
  if (!AUTH_MODES.includes(mode)) {
    throw new Error(`Unsupported VITE_AUTH_MODE "${mode}". Use "assignment" or "firebase".`)
  }
  return mode
}

export function isFirebaseMode() {
  return getAuthMode() === 'firebase'
}
