import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/stores"
import { MainLayout } from "@/components/layout/MainLayout"
import { LoginPage } from "@/pages/auth/Login"
import { SetupPage } from "@/pages/auth/Setup"
import { DashboardPage } from "@/pages/dashboard"
import { UsersPage } from "@/pages/users"
import { FarmsPage } from "@/pages/farms"
import { FarmDetailPage } from "@/pages/farms/[id]"
import { LotesPage } from "@/pages/lotes"
import { SubscriptionsPage } from "@/pages/subscriptions"
import { AnalyticsPage } from "@/pages/analytics"
import { NotificationsPage } from "@/pages/notifications"
import { BusinessPage } from "@/pages/business"
import { SupportPage } from "@/pages/support"
import { BlockedFarmsPage } from "@/pages/farms/blocked"
import { AuditPage } from "@/pages/audit"
import { PushNotificationsPage } from "@/pages/notifications/push"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { ROUTE_PERMISSIONS } from "@/lib/permissions"

function FullScreenLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized, hasAnyAdmin } = useAuthStore()

  if (!isInitialized) return <FullScreenLoader />

  // Si no hay admins en el sistema, mandar a /setup
  if (hasAnyAdmin === false && !admin) {
    return <Navigate to="/setup" replace />
  }

  if (!admin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized, hasAnyAdmin } = useAuthStore()

  if (!isInitialized) return <FullScreenLoader />

  if (admin) {
    return <Navigate to="/dashboard" replace />
  }

  // Si no hay admins, redirigir login → setup
  if (hasAnyAdmin === false) {
    return <Navigate to="/setup" replace />
  }

  return <>{children}</>
}

function SetupRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitialized, hasAnyAdmin } = useAuthStore()

  if (!isInitialized) return <FullScreenLoader />

  // Si ya hay un admin, no debería verse esta pantalla
  if (admin) return <Navigate to="/dashboard" replace />
  if (hasAnyAdmin === true) return <Navigate to="/login" replace />

  return <>{children}</>
}

export default function App() {
  const { initialize, checkBootstrapStatus } = useAuthStore()

  useEffect(() => {
    const unsubscribe = initialize()
    // Chequear si el sistema necesita setup inicial
    checkBootstrapStatus()
    return () => unsubscribe()
  }, [initialize, checkBootstrapStatus])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/setup"
          element={
            <SetupRoute>
              <SetupPage />
            </SetupRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/business" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/business']}><BusinessPage /></RoleGuard>
          } />
          <Route path="/users" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/users']}><UsersPage /></RoleGuard>
          } />
          <Route path="/farms" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/farms']}><FarmsPage /></RoleGuard>
          } />
          <Route path="/farms/blocked" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/farms/blocked']}><BlockedFarmsPage /></RoleGuard>
          } />
          <Route path="/farms/:id" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/farms']}><FarmDetailPage /></RoleGuard>
          } />
          <Route path="/lotes" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/lotes']}><LotesPage /></RoleGuard>
          } />
          <Route path="/subscriptions" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/subscriptions']}><SubscriptionsPage /></RoleGuard>
          } />
          <Route path="/analytics" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/analytics']}><AnalyticsPage /></RoleGuard>
          } />
          <Route path="/notifications" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/notifications']}><NotificationsPage /></RoleGuard>
          } />
          <Route path="/notifications/push" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/notifications/push']}><PushNotificationsPage /></RoleGuard>
          } />
          <Route path="/support" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/support']}><SupportPage /></RoleGuard>
          } />
          <Route path="/audit" element={
            <RoleGuard allowed={ROUTE_PERMISSIONS['/audit']}><AuditPage /></RoleGuard>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
