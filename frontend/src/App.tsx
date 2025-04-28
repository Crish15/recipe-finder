import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './layout/Layout'
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Login/LoginPage'
import ProfilePage from './pages/Profile/ProfilePage'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './pages/Login/AuthProvider'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      }
    />
    <Route
      path="/profile"
      element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      }
    />
    {/* Qui puoi aggiungere altre route protette */}
  </Routes>
)

function LoginPageWrapper() {
  const { token, setAuth } = useAuth()
  const location = useLocation()
  if (token) {
    // Se già loggato, vai in home
    return <Navigate to="/" state={{ from: location }} replace />
  }
  return <LoginPage onLoginSuccess={setAuth} />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route
            path="*"
            element={
              <Layout>
                <AppRoutes />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
