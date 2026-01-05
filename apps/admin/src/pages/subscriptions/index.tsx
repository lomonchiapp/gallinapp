import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, CreditCard, TrendingUp, CheckCircle, Users, Building2, Crown, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUsersWithSubscriptions, getSubscriptionStats, type UserWithSubscription, type SubscriptionStats } from "@/services/admin.service"

function formatDate(date?: Date): string {
  if (!date) return '—'
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const planColors: Record<string, { bg: string; text: string; border: string }> = {
  FREE: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  PRO: { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200' },
  ENTERPRISE: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  canceled: 'bg-red-100 text-red-700',
  past_due: 'bg-yellow-100 text-yellow-700',
  trialing: 'bg-blue-100 text-blue-700',
}

type FilterPlan = 'all' | 'FREE' | 'PRO' | 'ENTERPRISE'

export function SubscriptionsPage() {
  const [users, setUsers] = useState<UserWithSubscription[]>([])
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterPlan>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [usersData, statsData] = await Promise.all([
          getUsersWithSubscriptions(),
          getSubscriptionStats(),
        ])
        setUsers(usersData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading subscriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredUsers = users.filter(user => {
    const plan = user.subscription?.plan || 'FREE'
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
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card 
              className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setFilter('all')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stats?.total ?? 0}</div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${filter === 'FREE' ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setFilter('FREE')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Plan Free</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-slate-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stats?.free ?? 0}</div>
                <p className="text-xs text-slate-500 mt-1">
                  {stats?.total ? Math.round((stats.free / stats.total) * 100) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-primary-200 bg-primary-50/50 ${filter === 'PRO' ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setFilter('PRO')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-primary-600">Plan Pro</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary-700">{stats?.pro ?? 0}</div>
                <p className="text-xs text-primary-600 mt-1">
                  {stats?.total ? Math.round((stats.pro / stats.total) * 100) : 0}% del total
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-green-200 bg-green-50/50 ${filter === 'ENTERPRISE' ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setFilter('ENTERPRISE')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Plan Enterprise</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Crown className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{stats?.enterprise ?? 0}</div>
                <p className="text-xs text-green-600 mt-1">
                  {stats?.total ? Math.round((stats.enterprise / stats.total) * 100) : 0}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios con Suscripción</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuarios {filter !== 'all' ? `con plan ${filter}` : ''}
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
                        const plan = user.subscription?.plan || 'FREE'
                        const status = user.subscription?.status || 'active'
                        const colors = planColors[plan] || planColors.FREE
                        
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
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
                                {plan === 'ENTERPRISE' && <Crown className="h-3 w-3" />}
                                {plan === 'PRO' && <TrendingUp className="h-3 w-3" />}
                                {plan}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusColors[status] || 'bg-slate-100 text-slate-700'}`}>
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
                              <Button variant="outline" size="sm">
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
    </div>
  )
}
