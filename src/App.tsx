import { Route, Routes } from 'react-router'
import { Navbar } from './components/Navbar'
import { RequireAuth } from './components/RequireAuth'
import { LoginPage } from './pages/LoginPage'
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
