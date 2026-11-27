import { Route, Routes } from 'react-router'
import { Navbar } from './components/Navbar'
import { RequireAuth } from './components/RequireAuth'
import { FindParkingPage } from './pages/FindParkingPage'
import { LoginPage } from './pages/LoginPage'
import { MyReservationsPage } from './pages/MyReservationsPage'
import { RegisterPage } from './pages/RegisterPage'
import { WelcomePage } from './pages/WelcomePage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
        <Route
          path="*"
          element={
            <RequireAuth>
              <WelcomePage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  )
}

export default App
