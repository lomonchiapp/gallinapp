import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { DashboardPage } from './pages/dashboard'
import { OrganizationsPage } from './pages/organizations'
import { UsersPage } from './pages/users'
import { SubscriptionsPage } from './pages/subscriptions'
import { AnalyticsPage } from './pages/analytics'
import { LoginPage } from './pages/auth/Login'

function App() {
  // TODO: Implementar autenticación real
  const isAuthenticated = true // Temporal

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {isAuthenticated ? (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App

