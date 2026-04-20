import { useEffect, useState } from "react"
import { 
  Loader2, TrendingUp, Users, Building2, Calendar, Activity,
  BarChart3, ArrowUpRight, ArrowDownRight, Eye, Clock, Target,
  Egg, RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/stores"
import { PLAN_LABELS, PLAN_COLORS, type SubscriptionPlan } from "@/types/subscription"

interface EngagementMetrics {
  dau: number // Daily Active Users
  wau: number // Weekly Active Users
  mau: number // Monthly Active Users
  dauWauRatio: number // Stickiness
  avgSessionDuration: number // minutes
  sessionsPerUser: number
}

interface ModuleUsage {
  module: string
  icon: React.ComponentType<{ className?: string }>
  users: number
  sessions: number
  color: string
}

interface FunnelStep {
  name: string
  users: number
  conversionRate: number
}

// Mock engagement data
const mockEngagement: EngagementMetrics = {
  dau: 1250,
  wau: 4500,
  mau: 8500,
  dauWauRatio: 27.8,
  avgSessionDuration: 12.5,
  sessionsPerUser: 3.2,
}

const mockModuleUsage: ModuleUsage[] = [
  { module: 'Ponedoras', icon: Egg, users: 3200, sessions: 8500, color: 'bg-amber-500' },
  { module: 'Engorde', icon: Activity, users: 2800, sessions: 6200, color: 'bg-red-500' },
  { module: 'Levante', icon: TrendingUp, users: 1500, sessions: 3100, color: 'bg-blue-500' },
  { module: 'Gastos', icon: BarChart3, users: 4100, sessions: 9800, color: 'bg-emerald-500' },
  { module: 'Ventas', icon: Target, users: 2200, sessions: 4500, color: 'bg-purple-500' },
]

const mockFunnel: FunnelStep[] = [
  { name: 'Visita Landing', users: 10000, conversionRate: 100 },
  { name: 'Registro', users: 2500, conversionRate: 25 },
  { name: 'Crea Primera Granja', users: 1800, conversionRate: 72 },
  { name: 'Primer Registro', users: 1200, conversionRate: 67 },
  { name: 'Usa 7 Días', users: 800, conversionRate: 67 },
  { name: 'Convierte a Pago', users: 320, conversionRate: 40 },
]

export function AnalyticsPage() {
  const { 
    dashboardStats, 
    subscriptionStats,
    users,
    isLoadingStats,
    loadAllDashboardData,
    loadUsers,
  } = useAdminStore()

  const [engagement, setEngagement] = useState<EngagementMetrics>(mockEngagement)
  const [moduleUsage, setModuleUsage] = useState<ModuleUsage[]>(mockModuleUsage)
  const [funnel, setFunnel] = useState<FunnelStep[]>(mockFunnel)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    loadAllDashboardData()
    loadUsers()
  }, [loadAllDashboardData, loadUsers])

  // Calculate user metrics
  const usersWithFarms = users.filter(u => Object.keys(u.farms || {}).length > 0).length
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary-500" />
            Analytics
          </h1>
          <p className="text-slate-500">Métricas de uso y engagement de la plataforma</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {isLoadingStats ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Key Engagement Metrics */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-primary-100 text-sm font-medium mb-1">DAU</div>
                <div className="text-3xl font-bold">{engagement.dau.toLocaleString()}</div>
                <div className="text-xs text-primary-200 mt-1">Usuarios Diarios</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-blue-100 text-sm font-medium mb-1">WAU</div>
                <div className="text-3xl font-bold">{engagement.wau.toLocaleString()}</div>
                <div className="text-xs text-blue-200 mt-1">Usuarios Semanales</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="text-emerald-100 text-sm font-medium mb-1">MAU</div>
                <div className="text-3xl font-bold">{engagement.mau.toLocaleString()}</div>
                <div className="text-xs text-emerald-200 mt-1">Usuarios Mensuales</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-slate-500 text-sm font-medium mb-1">Stickiness</div>
                <div className="text-3xl font-bold text-slate-900">{engagement.dauWauRatio}%</div>
                <div className="text-xs text-slate-500 mt-1">DAU/WAU Ratio</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-slate-500 text-sm font-medium mb-1">Sesión Promedio</div>
                <div className="text-3xl font-bold text-slate-900">{engagement.avgSessionDuration}m</div>
                <div className="text-xs text-slate-500 mt-1">Duración media</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-slate-500 text-sm font-medium mb-1">Sesiones/Usuario</div>
                <div className="text-3xl font-bold text-slate-900">{engagement.sessionsPerUser}</div>
                <div className="text-xs text-slate-500 mt-1">Promedio diario</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Module Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary-500" />
                  Uso por Módulo
                </CardTitle>
                <CardDescription>Engagement por funcionalidad de la app</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleUsage.map((mod, i) => {
                    const maxSessions = Math.max(...moduleUsage.map(m => m.sessions))
                    const percentage = (mod.sessions / maxSessions) * 100
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-lg ${mod.color} flex items-center justify-center`}>
                              <mod.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-slate-900">{mod.module}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">{mod.sessions.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">{mod.users.toLocaleString()} usuarios</div>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${mod.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary-500" />
                  Distribución de Planes
                </CardTitle>
                <CardDescription>Usuarios por tipo de suscripción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(['FREE', 'BASIC', 'PRO', 'HACIENDA'] as SubscriptionPlan[]).map((plan) => {
                    const count = subscriptionStats ? 
                      subscriptionStats[plan.toLowerCase() as keyof typeof subscriptionStats] as number : 0
                    const total = subscriptionStats?.total || 1
                    const percentage = (count / total) * 100
                    const colors = PLAN_COLORS[plan]
                    
                    return (
                      <div key={plan} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${colors.bg.replace('100', '500')}`} />
                            <span className="font-medium text-slate-900">{PLAN_LABELS[plan]}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900">{count}</span>
                            <span className="text-slate-500 ml-1">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              plan === 'FREE' ? 'bg-slate-400' :
                              plan === 'BASIC' ? 'bg-blue-500' :
                              plan === 'PRO' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{subscriptionStats?.total || 0}</div>
                    <div className="text-xs text-slate-500">Total Usuarios</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {subscriptionStats ? 
                        Math.round(((subscriptionStats.basic + subscriptionStats.pro + subscriptionStats.hacienda) / subscriptionStats.total) * 100) : 0}%
                    </div>
                    <div className="text-xs text-slate-500">Tasa de Pago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-500" />
                Funnel de Conversión
              </CardTitle>
              <CardDescription>De visitante a cliente de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex items-end justify-between gap-4">
                  {funnel.map((step, i) => {
                    const height = (step.users / funnel[0].users) * 200
                    const isLast = i === funnel.length - 1
                    const dropoff = i > 0 ? 100 - step.conversionRate : 0
                    
                    return (
                      <div key={i} className="flex-1 text-center">
                        <div className="text-sm font-medium text-slate-700 mb-2">{step.name}</div>
                        <div 
                          className={`mx-auto rounded-t-lg transition-all ${
                            isLast ? 'bg-green-500' : 'bg-primary-500'
                          }`}
                          style={{ 
                            height: `${Math.max(height, 40)}px`,
                            width: '80%',
                          }}
                        />
                        <div className="mt-2">
                          <div className="text-lg font-bold text-slate-900">{step.users.toLocaleString()}</div>
                          {i > 0 && (
                            <div className={`text-xs ${dropoff > 50 ? 'text-red-500' : 'text-amber-500'}`}>
                              -{dropoff.toFixed(0)}% dropoff
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Overall conversion rate */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {((funnel[funnel.length - 1].users / funnel[0].users) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-500">Conversión Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {funnel[funnel.length - 1].users}
                    </div>
                    <div className="text-sm text-slate-500">Clientes de Pago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Crecimiento Usuarios
                </CardTitle>
                {growth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth > 0 ? '+' : ''}{growth}%
                </div>
                <p className="text-xs text-slate-500">vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Nuevos Este Mes
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{dashboardStats?.newUsersThisMonth ?? 0}</div>
                <p className="text-xs text-slate-500">usuarios registrados</p>
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
                  Nuevas Granjas
                </CardTitle>
                <Building2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{dashboardStats?.newFarmsThisMonth ?? 0}</div>
                <p className="text-xs text-slate-500">este mes</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
