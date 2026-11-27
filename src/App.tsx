import { Navigate, Route, Routes } from 'react-router'
import { homePathFor, useAuth } from './auth/auth-context'
import { Navbar } from './components/Navbar'
import { RequireAuth } from './components/RequireAuth'
import { FindParkingPage } from './pages/FindParkingPage'
import { LoginPage } from './pages/LoginPage'
import { MyReservationsPage } from './pages/MyReservationsPage'
import { ParkingDeskPage } from './pages/ParkingDeskPage'
import { RegisterPage } from './pages/RegisterPage'

/** Sends each user to their own start page (or to login). */
function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <p className="page muted">Loading…</p>
  return <Navigate to={user ? homePathFor(user.role) : '/login'} replace />
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Driver pages */}
        <Route
          path="/find-parking"
          element={
            <RequireAuth roles={['driver']}>
              <FindParkingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <RequireAuth roles={['driver']}>
              <MyReservationsPage />
            </RequireAuth>
          }
        />

        {/* Attendant / admin page */}
        <Route
          path="/desk"
          element={
            <RequireAuth roles={['attendant', 'admin']}>
              <ParkingDeskPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </>
  )
}

export default App
