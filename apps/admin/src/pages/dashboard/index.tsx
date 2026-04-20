import { useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  Building2, Users, CreditCard, TrendingUp, Loader2, Egg, 
  DollarSign, ArrowUpRight, ArrowDownRight, Activity,
  Drumstick, Bird, ChevronRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/stores"
import { PLAN_LABELS, PLAN_COLORS } from "@/types/subscription"

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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
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

  // Calcular MRR estimado
  const estimatedMRR = (subscriptionStats?.basic ?? 0) * 39.99 + 
                       (subscriptionStats?.pro ?? 0) * 49.99 + 
                       (subscriptionStats?.hacienda ?? 0) * 99.99

  const stats = [
    { 
      title: "Total Granjas", 
      value: dashboardStats?.totalFarms ?? "-", 
      change: `+${dashboardStats?.newFarmsThisMonth ?? 0} este mes`,
      changeType: "positive",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    { 
      title: "Usuarios Activos", 
      value: dashboardStats?.totalUsers ?? "-", 
      change: `+${dashboardStats?.newUsersThisMonth ?? 0} este mes`,
      changeType: "positive",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    { 
      title: "Suscripciones Activas", 
      value: subscriptionStats ? (subscriptionStats.basic + subscriptionStats.pro + subscriptionStats.hacienda) : "-", 
      change: `${subscriptionStats?.free ?? 0} gratuitos`,
      changeType: "neutral",
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    { 
      title: "MRR Estimado", 
      value: formatCurrency(estimatedMRR), 
      change: `${formatCurrency(estimatedMRR * 12)} ARR`,
      changeType: "positive",
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-100"
    },
  ]

  const activityTypeConfig: Record<string, { icon: typeof Users; color: string; bg: string }> = {
    user_created: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    farm_created: { icon: Building2, color: 'text-green-600', bg: 'bg-green-100' },
    subscription_changed: { icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Bienvenido al panel de administración de Gallinapp</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Activity className="h-4 w-4" />
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {isLoadingStats ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.changeType === 'positive' && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                    {stat.changeType === 'negative' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                    <p className={`text-xs ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en la plataforma</CardDescription>
                </div>
                <Link to="/users" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No hay actividad reciente</p>
                  ) : (
                    recentActivity.slice(0, 6).map((activity) => {
                      const config = activityTypeConfig[activity.type] || activityTypeConfig.user_created
                      const Icon = config.icon
                      return (
                        <div key={activity.id} className="flex items-center gap-4 text-sm">
                          <div className={`h-9 w-9 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">{activity.description}</p>
                            <p className="text-slate-500 text-xs">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                          {activity.farmId && (
                            <Link 
                              to={`/farms/${activity.farmId}`}
                              className="shrink-0 text-xs text-primary-600 hover:text-primary-700"
                            >
                              Ver granja
                            </Link>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Planes</CardTitle>
                <CardDescription>Suscripciones activas por plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { plan: "FREE", count: subscriptionStats?.free ?? 0 },
                    { plan: "BASIC", count: subscriptionStats?.basic ?? 0 },
                    { plan: "PRO", count: subscriptionStats?.pro ?? 0 },
                    { plan: "HACIENDA", count: subscriptionStats?.hacienda ?? 0 },
                  ].map((item) => {
                    const colors = PLAN_COLORS[item.plan as keyof typeof PLAN_COLORS]
                    const label = PLAN_LABELS[item.plan as keyof typeof PLAN_LABELS]
                    const total = (subscriptionStats?.free ?? 0) + (subscriptionStats?.basic ?? 0) + 
                                  (subscriptionStats?.pro ?? 0) + (subscriptionStats?.hacienda ?? 0)
                    const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
                    
                    return (
                      <div key={item.plan} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                              {label}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-slate-900">{item.count}</span>
                            <span className="text-slate-400 ml-1">({percentage}%)</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.plan === 'FREE' ? 'bg-slate-400' :
                              item.plan === 'BASIC' ? 'bg-blue-500' :
                              item.plan === 'PRO' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Revenue by Plan */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Ingresos por Plan</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Básico</span>
                      <span className="font-medium">{formatCurrency((subscriptionStats?.basic ?? 0) * 39.99)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gallinapp Pro</span>
                      <span className="font-medium">{formatCurrency((subscriptionStats?.pro ?? 0) * 49.99)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hacienda</span>
                      <span className="font-medium">{formatCurrency((subscriptionStats?.hacienda ?? 0) * 99.99)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Egg className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <CardDescription>Lotes Ponedoras</CardDescription>
                  <CardTitle className="text-lg">-</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Drumstick className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardDescription>Lotes Engorde</CardDescription>
                  <CardTitle className="text-lg">-</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Bird className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardDescription>Lotes Levantes</CardDescription>
                  <CardTitle className="text-lg">-</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
