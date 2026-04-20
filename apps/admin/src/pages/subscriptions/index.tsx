import { useEffect, useState } from "react"
import { 
  Loader2, TrendingUp, CheckCircle, Users, Building2, Crown, 
  Search, Rocket, UserCircle, DollarSign, ArrowUpRight, ArrowDownRight 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ManageSubscriptionModal } from "@/components/subscriptions/ManageSubscriptionModal"
import { useAuthStore } from "@/stores/authStore"
import { 
  getUsersWithSubscriptions, 
  getSubscriptionStats, 
  getBusinessMetrics,
  type UserWithSubscription
} from "@/services/admin.service"
import { 
  type SubscriptionStats, 
  type SubscriptionPlan,
  PLAN_COLORS, 
  PLAN_LABELS, 
  STATUS_COLORS 
} from "@/types/subscription"

function formatDate(date?: Date): string {
  if (!date) return '—'
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

type FilterPlan = 'all' | SubscriptionPlan

const planIcons: Record<SubscriptionPlan, React.ComponentType<{ className?: string }>> = {
  FREE: UserCircle,
  BASIC: Rocket,
  PRO: TrendingUp,
  HACIENDA: Crown,
}

export function SubscriptionsPage() {
  const { admin } = useAuthStore()
  const [users, setUsers] = useState<UserWithSubscription[]>([])
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [metrics, setMetrics] = useState<{
    mrr: number
    arr: number
    churnRate: number
    conversionRate: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterPlan>('all')
  const [search, setSearch] = useState('')
  
  // Modal de gestión de suscripción
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)

  async function loadData() {
    setIsLoading(true)
    try {
      const [usersData, statsData, metricsData] = await Promise.all([
        getUsersWithSubscriptions(),
        getSubscriptionStats(),
        getBusinessMetrics(),
      ])
      setUsers(usersData)
      setStats(statsData)
      setMetrics({
        mrr: metricsData.mrr,
        arr: metricsData.arr,
        churnRate: metricsData.churnRate,
        conversionRate: metricsData.conversionRate,
      })
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  
  function handleManageUser(user: UserWithSubscription) {
    setSelectedUser(user)
    setIsManageModalOpen(true)
  }
  
  function handleSubscriptionUpdated() {
    // Recargar datos después de actualizar una suscripción
    loadData()
  }

  const filteredUsers = users.filter(user => {
    const plan = (user.subscription?.plan?.toUpperCase() || 'FREE') as SubscriptionPlan
    if (filter !== 'all' && plan !== filter) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        user.email.toLowerCase().includes(searchLower) ||
        user.displayName.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suscripciones</h1>
          <p className="text-slate-500">Gestiona las suscripciones de los usuarios</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Buscar usuario..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Revenue Metrics */}
          {metrics && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-primary-100">MRR</CardTitle>
                  <DollarSign className="h-5 w-5 text-primary-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(metrics.mrr)}</div>
                  <p className="text-xs text-primary-200 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +12% vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-100">ARR</CardTitle>
                  <TrendingUp className="h-5 w-5 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(metrics.arr)}</div>
                  <p className="text-xs text-emerald-200 mt-1">Proyección anual</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Churn Rate</CardTitle>
                  <ArrowDownRight className="h-5 w-5 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{metrics.churnRate.toFixed(1)}%</div>
                  <p className="text-xs text-slate-500 mt-1">Cancelaciones este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Conversión</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{metrics.conversionRate.toFixed(1)}%</div>
                  <p className="text-xs text-slate-500 mt-1">Trial → Pago</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Plan Stats Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card 
              className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setFilter('all')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total</CardTitle>
                <Users className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stats?.total ?? 0}</div>
                <p className="text-xs text-slate-500 mt-1">{stats?.active ?? 0} activos</p>
              </CardContent>
            </Card>

            {(['FREE', 'BASIC', 'PRO', 'HACIENDA'] as SubscriptionPlan[]).map((plan) => {
              const Icon = planIcons[plan]
              const count = stats ? stats[plan.toLowerCase() as keyof SubscriptionStats] as number : 0
              const colors = PLAN_COLORS[plan]
              const isSelected = filter === plan
              
              return (
                <Card 
                  key={plan}
                  className={`cursor-pointer transition-all ${colors.border} ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                  onClick={() => setFilter(plan)}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className={`text-sm font-medium ${colors.text}`}>
                      {PLAN_LABELS[plan]}
                    </CardTitle>
                    <div className={`h-8 w-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${colors.text}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${colors.text}`}>{count}</div>
                    <p className="text-xs text-slate-500 mt-1">
                      {stats?.total ? Math.round((count / stats.total) * 100) : 0}% del total
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios con Suscripción</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuarios {filter !== 'all' ? `con plan ${PLAN_LABELS[filter]}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500">No hay usuarios con este filtro</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Usuario
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Plan
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Estado
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Granjas
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Inicio
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Vencimiento
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user) => {
                        const plan = (user.subscription?.plan?.toUpperCase() || 'FREE') as SubscriptionPlan
                        const status = user.subscription?.status || 'inactive'
                        const colors = PLAN_COLORS[plan]
                        const Icon = planIcons[plan]
                        
                        return (
                          <tr key={user.uid} className="hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={user.photoURL || undefined} />
                                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-slate-900">{user.displayName || 'Sin nombre'}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
                                <Icon className="h-3 w-3" />
                                {PLAN_LABELS[plan]}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'}`}>
                                {status === 'active' && <CheckCircle className="h-3 w-3" />}
                                {status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                {user.farmCount}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-slate-600">
                              {formatDate(user.subscription?.startDate)}
                            </td>
                            <td className="py-4 px-4 text-sm text-slate-600">
                              {formatDate(user.subscription?.endDate)}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleManageUser(user)}
                              >
                                Gestionar
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Modal de gestión de suscripción */}
      {admin && (
        <ManageSubscriptionModal
          user={selectedUser}
          open={isManageModalOpen}
          onOpenChange={setIsManageModalOpen}
          onSuccess={handleSubscriptionUpdated}
          adminInfo={{ uid: admin.uid, email: admin.email }}
        />
      )}
    </div>
  )
}
