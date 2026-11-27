import { useAuth } from '../auth/auth-context'

/** Temporary landing page until the role pages are added. */
export function WelcomePage() {
  const { user } = useAuth()
  return (
    <main className="page">
      <h1>Welcome, {user?.fullName}</h1>
      <p className="muted">You are logged in as {user?.role}.</p>
    </main>
  )
}
