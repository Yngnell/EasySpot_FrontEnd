import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../auth/auth-context'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">P</span> EasySpot
        </NavLink>

        {user && (
          <nav className="nav-links">
            {user.role === 'driver' && (
              <>
                <NavLink to="/find-parking">Find Parking</NavLink>
                <NavLink to="/my-reservations">My Reservations</NavLink>
              </>
            )}
            {user.role !== 'driver' && <NavLink to="/desk">Parking Desk</NavLink>}
          </nav>
        )}

        {user && (
          <div className="nav-user">
            <span>
              {user.fullName} <span className="role-tag">{user.role}</span>
            </span>
            <button type="button" className="secondary small" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
