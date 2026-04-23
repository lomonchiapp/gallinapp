import { useEffect, useState } from "react"
import {
  Loader2, DollarSign, TrendingUp, Users, Building2,
  ArrowUpRight, ArrowDownRight, PieChart, Activity,
  CreditCard, RefreshCw, AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getBusinessMetrics, 
  getSubscriptionStats, 
  getDashboardStats,
  getBlockedFarms,
  type BusinessMetrics,
  type BlockedFarm
} from "@/services/admin.service"
import { 
  type SubscriptionStats, 
  type SubscriptionPlan,
  PLAN_LABELS, 
  PLAN_COLORS,
  PLAN_MRR
} from "@/types/subscription"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function BusinessPage() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [dashboardStats, setDashboardStats] = useState<{ totalUsers: number; totalFarms: number } | null>(null)
  const [blockedFarms, setBlockedFarms] = useState<BlockedFarm[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [metricsData, statsData, dashData, blockedData] = await Promise.all([
        getBusinessMetrics(),
        getSubscriptionStats(),
        getDashboardStats(),
        getBlockedFarms(),
      ])
      setMetrics(metricsData)
      setStats(statsData)
      setDashboardStats(dashData)
      setBlockedFarms(blockedData.slice(0, 5)) // Top 5 blocked
    } catch (error) {
      console.error('Error loading business data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  // Calculate some derived metrics
  const paidUsers = stats ? stats.basic + stats.pro + stats.hacienda : 0
  const freeToPayRatio = stats && stats.total > 0 ? (paidUsers / stats.total) * 100 : 0
  const ltv = metrics ? metrics.averageRevenuePerUser * 12 : 0 // Simple 12 month LTV

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Dashboard</h1>
          <p className="text-slate-500">Métricas de negocio y rendimiento financiero</p>
        </div>
        <Button onClick={loadData} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Revenue Cards - Hero Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0 shadow-lg shadow-primary-500/25">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-100 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              MRR (Monthly Recurring Revenue)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(metrics?.mrr || 0)}</div>
            <div className="flex items-center gap-2 mt-2 text-sm text-primary-200">
              <ArrowUpRight className="h-4 w-4" />
              <span>+{formatPercent(metrics?.growthRate || 12)} vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/25">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              ARR (Annual Recurring Revenue)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(metrics?.arr || 0)}</div>
            <p className="text-sm text-emerald-200 mt-2">Proyección anualizada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              LTV (Lifetime Value)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{formatCurrency(ltv)}</div>
            <p className="text-sm text-slate-500 mt-2">Valor promedio por cliente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              ARPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">
              {formatCurrency(metrics?.averageRevenuePerUser || 0)}
            </div>
            <p className="text-sm text-slate-500 mt-2">Ingreso promedio por usuario</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-slate-900">
                {formatPercent(metrics?.churnRate || 0)}
              </div>
              {(metrics?.churnRate || 0) < 5 ? (
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowDownRight className="h-4 w-4" />
                  Saludable
                </span>
              ) : (
                <span className="flex items-center text-red-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  Atención
                </span>
              )}
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${(metrics?.churnRate || 0) < 5 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(metrics?.churnRate || 0, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Meta: {'<'}5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Trial → Paid Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-slate-900">
                {formatPercent(metrics?.conversionRate || 0)}
              </div>
              {(metrics?.conversionRate || 0) > 20 ? (
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  Excelente
                </span>
              ) : (
                <span className="flex items-center text-amber-600 text-sm">
                  Mejorable
                </span>
              )}
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${Math.min(metrics?.conversionRate || 0, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Meta: {'>'}25%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Free → Paid Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-slate-900">
                {formatPercent(freeToPayRatio)}
              </div>
              <span className="text-slate-500 text-sm">
                {paidUsers} de {stats?.total || 0}
              </span>
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${freeToPayRatio}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Usuarios con plan de pago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary-500" />
              Ingresos por Plan
            </CardTitle>
            <CardDescription>Distribución de MRR por tipo de plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(['BASIC', 'PRO', 'HACIENDA'] as const).map((plan) => {
                const revenue = metrics?.revenueByPlan?.[plan] || 0
                const percentage = metrics?.mrr && metrics.mrr > 0 
                  ? (revenue / metrics.mrr) * 100 
                  : 0
                const colors = PLAN_COLORS[plan]
                const userCount = stats ? stats[plan.toLowerCase() as keyof SubscriptionStats] as number : 0
                
                return (
                  <div key={plan} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                        <span className="font-medium text-slate-700">{PLAN_LABELS[plan]}</span>
                        <span className="text-slate-400 text-sm">({userCount} usuarios)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{formatCurrency(revenue)}</span>
                        <span className="text-slate-400 text-sm ml-2">({formatPercent(percentage)})</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
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

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total MRR</span>
                <span className="font-bold text-slate-900">{formatCurrency(metrics?.mrr || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              Distribución de Usuarios
            </CardTitle>
            <CardDescription>Usuarios por plan de suscripción</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {(['FREE', 'BASIC', 'PRO', 'HACIENDA'] as SubscriptionPlan[]).map((plan) => {
                const count = stats ? stats[plan.toLowerCase() as keyof SubscriptionStats] as number : 0
                const percentage = stats && stats.total > 0 ? (count / stats.total) * 100 : 0
                const colors = PLAN_COLORS[plan]
                const mrr = plan !== 'FREE' ? count * PLAN_MRR[plan] : 0
                
                return (
                  <div 
                    key={plan} 
                    className={`p-4 rounded-xl border-2 ${colors.border} ${colors.bg.replace('100', '50')}`}
                  >
                    <div className={`text-sm font-medium ${colors.text}`}>{PLAN_LABELS[plan]}</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{count}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatPercent(percentage)} del total
                    </div>
                    {plan !== 'FREE' && (
                      <div className={`text-xs font-medium ${colors.text} mt-2`}>
                        {formatCurrency(mrr)} MRR
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Active Stats */}
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
                <div className="text-xs text-slate-500">Activos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats?.trialing || 0}</div>
                <div className="text-xs text-slate-500">En Trial</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats?.pastDue || 0}</div>
                <div className="text-xs text-slate-500">Vencidos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blocked Farms Alert */}
      {blockedFarms.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Granjas Bloqueadas ({blockedFarms.length})
            </CardTitle>
            <CardDescription className="text-red-600">
              Granjas con suscripciones vencidas que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blockedFarms.slice(0, 3).map((farm) => (
                <div 
                  key={farm.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-red-400" />
                    <div>
                      <div className="font-medium text-slate-900">{farm.displayName || farm.name}</div>
                      <div className="text-xs text-slate-500">{farm.ownerEmail}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    Gestionar
                  </Button>
                </div>
              ))}
            </div>
            {blockedFarms.length > 3 && (
              <Button variant="ghost" className="w-full mt-3 text-red-600 hover:bg-red-100">
                Ver todas ({blockedFarms.length})
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{dashboardStats?.totalUsers || 0}</div>
                <div className="text-sm text-slate-500">Total Usuarios</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{dashboardStats?.totalFarms || 0}</div>
                <div className="text-sm text-slate-500">Total Granjas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{metrics?.activeUsers || 0}</div>
                <div className="text-sm text-slate-500">Usuarios Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{metrics?.trialingUsers || 0}</div>
                <div className="text-sm text-slate-500">En Periodo Trial</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


