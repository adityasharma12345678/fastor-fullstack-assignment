import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../utils/auth.js'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  return getToken() ? children : <Navigate to="/" replace state={{ from: location }} />
}
