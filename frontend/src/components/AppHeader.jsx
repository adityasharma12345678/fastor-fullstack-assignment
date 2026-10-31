import { Link, useNavigate } from 'react-router-dom'
import useToast from '../hooks/useToast.js'
import { clearSession, getUser } from '../utils/auth.js'
import { isFirebaseMode } from '../services/authMode.js'
import { signOutFirebaseUser } from '../services/firebaseAuth.js'
import Brand from './Brand.jsx'

export default function AppHeader() {
  const navigate = useNavigate()
  const { notify } = useToast()
  const user = getUser()

  async function signOut() {
    try {
      if (isFirebaseMode()) await signOutFirebaseUser()
    } catch (error) {
      notify(error.message || 'Firebase sign-out failed. The local session was cleared.', 'error')
    }
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Brand compact />
        <nav className="app-nav" aria-label="Main navigation">
          <Link to="/restaurants" className="nav-link">
            Restaurants
          </Link>
        </nav>
        <div className="account-actions">
          <span className="account-label">{user?.user_name || 'Guest'}</span>
          <button className="avatar-button" onClick={signOut} title="Sign out" aria-label="Sign out">
            {user?.user_name?.[0]?.toUpperCase() || 'U'}
          </button>
        </div>
      </div>
    </header>
  )
}
