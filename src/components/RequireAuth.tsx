import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import type { Role } from '../api/types'
import { homePathFor, useAuth } from '../auth/auth-context'

interface Props {
  children: ReactNode
  /** If given, only these roles may open the page */
  roles?: Role[]
}

/**
 * Protects a page: logged-out users go to /login, and users with the wrong
 * role go back to their own home page. The backend checks the same rules
 * again, so this is only for a nicer experience, not for security.
 */
export function RequireAuth({ children, roles }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="page muted">Loading…</p>
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePathFor(user.role)} replace />
  }
  return children
}
