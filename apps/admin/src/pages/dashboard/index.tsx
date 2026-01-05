import { useEffect } from "react"
import { Building2, Users, CreditCard, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/stores"

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Hace un momento"
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays === 1) return "Ayer"
  if (diffDays < 7) return `Hace ${diffDays} días`
  return date.toLocaleDateString()
}

export function DashboardPage() {
  const { 
    dashboardStats, 
    recentActivity, 
    subscriptionStats,
    isLoadingStats,
    loadAllDashboardData 
  } = useAdminStore()

  useEffect(() => {
    loadAllDashboardData()
  }, [loadAllDashboardData])

  const stats = [
    { 
      title: "Total Granjas", 
      value: dashboardStats?.totalFarms ?? "-", 
      change: `+${dashboardStats?.newFarmsThisMonth ?? 0} este mes`, 
      icon: Building2 
    },
    { 
      title: "Usuarios Activos", 
      value: dashboardStats?.totalUsers ?? "-", 
      change: `+${dashboardStats?.newUsersThisMonth ?? 0} este mes`, 
      icon: Users 
    },
    { 
      title: "Suscripciones", 
      value: dashboardStats?.activeSubscriptions ?? "-", 
      change: "Activas", 
      icon: CreditCard 
    },
    { 
      title: "Plan Pro", 
      value: subscriptionStats?.pro ?? "-", 
      change: `${subscriptionStats?.enterprise ?? 0} Enterprise`, 
      icon: TrendingUp 
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Bienvenido al panel de administración de Gallinapp</p>
      </div>

      {isLoadingStats ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay actividad reciente</p>
                  ) : (
                    recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 text-sm">
                        <div className={`h-2 w-2 rounded-full ${
                          activity.type === 'user_created' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{activity.description}</p>
                          <p className="text-slate-500">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suscripciones por Plan</CardTitle>
                <CardDescription>Distribución de planes activos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { plan: "Free", count: subscriptionStats?.free ?? 0, color: "bg-slate-400" },
                    { plan: "Pro", count: subscriptionStats?.pro ?? 0, color: "bg-primary-500" },
                    { plan: "Enterprise", count: subscriptionStats?.enterprise ?? 0, color: "bg-green-500" },
                  ].map((item) => (
                    <div key={item.plan} className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <div className="flex-1 text-sm font-medium text-slate-900">{item.plan}</div>
                      <div className="text-sm text-slate-500">{item.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
