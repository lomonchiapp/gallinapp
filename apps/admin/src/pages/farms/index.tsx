import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Search, Building2, CheckCircle, XCircle, Filter, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAdminStore } from "@/stores"
import { PLAN_COLORS, PLAN_LABELS } from "@/types/subscription"

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

type PlanFilter = 'all' | 'FREE' | 'BASIC' | 'PRO' | 'HACIENDA'
type StatusFilter = 'all' | 'active' | 'inactive'

export function FarmsPage() {
  const { farms, isLoadingFarms, loadFarms } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    loadFarms()
  }, [loadFarms])

  // Filtrar granjas
  const filteredFarms = farms.filter(farm => {
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm || 
      (farm.displayName || farm.name).toLowerCase().includes(searchLower) ||
      farm.farmCode?.toLowerCase().includes(searchLower) ||
      farm.id.toLowerCase().includes(searchLower)
    
    // Plan filter
    const farmPlan = farm.subscription?.plan?.toUpperCase() || 'FREE'
    const matchesPlan = planFilter === 'all' || farmPlan === planFilter
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && farm.isActive) ||
      (statusFilter === 'inactive' && !farm.isActive)
    
    return matchesSearch && matchesPlan && matchesStatus
  })

  // Stats
  const stats = {
    total: farms.length,
    active: farms.filter(f => f.isActive).length,
    inactive: farms.filter(f => !f.isActive).length,
    byPlan: {
      FREE: farms.filter(f => (f.subscription?.plan?.toUpperCase() || 'FREE') === 'FREE').length,
      BASIC: farms.filter(f => f.subscription?.plan?.toUpperCase() === 'BASIC').length,
      PRO: farms.filter(f => f.subscription?.plan?.toUpperCase() === 'PRO').length,
      HACIENDA: farms.filter(f => f.subscription?.plan?.toUpperCase() === 'HACIENDA').length,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Granjas</h1>
          <p className="text-slate-500">Gestiona las granjas registradas en Gallinapp</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        <Card className="col-span-2 lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Total Granjas</p>
              </div>
              <div className="text-sm">
                <span className="text-green-600">{stats.active} activas</span>
                <span className="text-slate-400 mx-1">•</span>
                <span className="text-red-600">{stats.inactive} inactivas</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {(['FREE', 'BASIC', 'PRO', 'HACIENDA'] as const).map(plan => {
          const colors = PLAN_COLORS[plan]
          return (
            <Card key={plan}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-slate-900">{stats.byPlan[plan]}</p>
                    <p className={`text-xs font-medium ${colors.text}`}>{PLAN_LABELS[plan]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Buscar por nombre, código o ID..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as PlanFilter)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los planes</SelectItem>
                  <SelectItem value="FREE">Colaborador</SelectItem>
                  <SelectItem value="BASIC">Básico</SelectItem>
                  <SelectItem value="PRO">Gallinapp Pro</SelectItem>
                  <SelectItem value="HACIENDA">Hacienda</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farms List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Granjas</CardTitle>
          <CardDescription>
            {filteredFarms.length} de {farms.length} granjas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingFarms ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredFarms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">
                {farms.length === 0 
                  ? "No hay granjas registradas" 
                  : "No se encontraron granjas con los filtros aplicados"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Granja
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Código
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Plan
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Estado
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Creada
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFarms.map((farm) => {
                    const planKey = (farm.subscription?.plan?.toUpperCase() || 'FREE') as keyof typeof PLAN_COLORS
                    const planColors = PLAN_COLORS[planKey] || PLAN_COLORS.FREE
                    const planLabel = PLAN_LABELS[planKey] || 'Colaborador'
                    
                    return (
                      <tr key={farm.id} className="hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <Link to={`/farms/${farm.id}`} className="flex items-center gap-3 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors">
                              <Building2 className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
                                {farm.displayName || farm.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                ID: {farm.id.slice(0, 8)}...
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                            {farm.farmCode || '—'}
                          </code>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${planColors.bg} ${planColors.text}`}>
                            {planLabel}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            {farm.isActive ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">Activa</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-600">Inactiva</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {formatDate(farm.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link to={`/farms/${farm.id}`}>
                            <Button variant="ghost" size="sm">
                              Ver detalles
                            </Button>
                          </Link>
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
    </div>
  )
}
