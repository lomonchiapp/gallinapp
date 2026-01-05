import { useEffect } from "react"
import { Loader2, TrendingUp, Users, Building2, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/stores"

export function AnalyticsPage() {
  const { 
    dashboardStats, 
    subscriptionStats,
    users,
    farms,
    isLoadingStats,
    loadAllDashboardData,
    loadUsers,
    loadFarms,
  } = useAdminStore()

  useEffect(() => {
    loadAllDashboardData()
    loadUsers()
    loadFarms()
  }, [loadAllDashboardData, loadUsers, loadFarms])

  // Calcular métricas
  const usersWithFarms = users.filter(u => Object.keys(u.farms || {}).length > 0).length
  const usersNoFarms = users.length - usersWithFarms
  const adminUsers = users.filter(u => u.globalRole).length

  // Calcular usuarios por mes (simplificado)
  const now = new Date()
  const thisMonth = users.filter(u => {
    const d = u.createdAt
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const lastMonth = users.filter(u => {
    const d = u.createdAt
    const lastM = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getMonth() === lastM.getMonth() && d.getFullYear() === lastM.getFullYear()
  }).length

  const growth = lastMonth > 0 ? Math.round((thisMonth - lastMonth) / lastMonth * 100) : 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500">Métricas y estadísticas de la plataforma</p>
      </div>

      {isLoadingStats ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Crecimiento Usuarios
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {growth > 0 ? '+' : ''}{growth}%
                </div>
                <p className="text-xs text-slate-500">vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Usuarios Activos
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{usersWithFarms}</div>
                <p className="text-xs text-slate-500">con granjas asignadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Usuarios sin Granja
                </CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{usersNoFarms}</div>
                <p className="text-xs text-slate-500">pendientes de asignar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Administradores
                </CardTitle>
                <Building2 className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{adminUsers}</div>
                <p className="text-xs text-slate-500">con globalRole</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos y detalles */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Planes</CardTitle>
                <CardDescription>Suscripciones activas por tipo de plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Free', 
                      value: subscriptionStats?.free ?? 0, 
                      color: 'bg-slate-500',
                      percent: dashboardStats?.totalFarms 
                        ? Math.round((subscriptionStats?.free ?? 0) / dashboardStats.totalFarms * 100) 
                        : 0
                    },
                    { 
                      label: 'Pro', 
                      value: subscriptionStats?.pro ?? 0, 
                      color: 'bg-primary-500',
                      percent: dashboardStats?.totalFarms 
                        ? Math.round((subscriptionStats?.pro ?? 0) / dashboardStats.totalFarms * 100) 
                        : 0
                    },
                    { 
                      label: 'Enterprise', 
                      value: subscriptionStats?.enterprise ?? 0, 
                      color: 'bg-green-500',
                      percent: dashboardStats?.totalFarms 
                        ? Math.round((subscriptionStats?.enterprise ?? 0) / dashboardStats.totalFarms * 100) 
                        : 0
                    },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-900">{item.label}</span>
                        <span className="text-slate-500">{item.value} ({item.percent}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registro Mensual</CardTitle>
                <CardDescription>Nuevos usuarios y granjas este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-slate-900">
                        {dashboardStats?.newUsersThisMonth ?? 0}
                      </p>
                      <p className="text-sm text-slate-500">Nuevos usuarios</p>
                    </div>
                    <div className="text-right">
                      <Calendar className="h-4 w-4 text-slate-400 inline mr-1" />
                      <span className="text-xs text-slate-400">Este mes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <Building2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-slate-900">
                        {dashboardStats?.newFarmsThisMonth ?? 0}
                      </p>
                      <p className="text-sm text-slate-500">Nuevas granjas</p>
                    </div>
                    <div className="text-right">
                      <Calendar className="h-4 w-4 text-slate-400 inline mr-1" />
                      <span className="text-xs text-slate-400">Este mes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
