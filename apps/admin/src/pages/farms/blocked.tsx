import { useState, useEffect } from "react"
import { 
  Loader2, AlertTriangle, Building2, User, Mail, Calendar, 
  CreditCard, RefreshCw, Send, Clock, DollarSign, MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getBlockedFarms, type BlockedFarm } from "@/services/admin.service"
import { PLAN_LABELS, PLAN_COLORS, type SubscriptionPlan } from "@/types/subscription"

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

export function BlockedFarmsPage() {
  const [farms, setFarms] = useState<BlockedFarm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFarms, setSelectedFarms] = useState<Set<string>>(new Set())

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getBlockedFarms()
      setFarms(data)
    } catch (error) {
      console.error('Error loading blocked farms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleSelect = (farmId: string) => {
    setSelectedFarms(prev => {
      const next = new Set(prev)
      if (next.has(farmId)) {
        next.delete(farmId)
      } else {
        next.add(farmId)
      }
      return next
    })
  }

  const selectAll = () => {
    if (selectedFarms.size === farms.length) {
      setSelectedFarms(new Set())
    } else {
      setSelectedFarms(new Set(farms.map(f => f.id)))
    }
  }

  // Group farms by how long they've been blocked
  const recentlyBlocked = farms.filter(f => {
    if (!f.blockedSince) return true
    const daysSinceBlocked = (Date.now() - f.blockedSince.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceBlocked <= 7
  })

  const longBlocked = farms.filter(f => {
    if (!f.blockedSince) return false
    const daysSinceBlocked = (Date.now() - f.blockedSince.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceBlocked > 7
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Granjas Bloqueadas
          </h1>
          <p className="text-slate-500">Granjas con suscripciones vencidas o inactivas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          {selectedFarms.size > 0 && (
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Enviar Recordatorio ({selectedFarms.size})
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">{farms.length}</div>
                <div className="text-sm text-red-600">Total Bloqueadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{recentlyBlocked.length}</div>
                <div className="text-sm text-slate-500">Últimos 7 días</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{longBlocked.length}</div>
                <div className="text-sm text-slate-500">+7 días bloqueadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(farms.length * 45)}
                </div>
                <div className="text-sm text-slate-500">Ingreso Potencial</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Farms List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Granjas Bloqueadas</CardTitle>
              <CardDescription>
                Granjas que requieren renovación de suscripción
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={selectAll}>
              {selectedFarms.size === farms.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : farms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-green-400 mb-4" />
              <p className="text-lg font-medium text-green-600">¡Excelente!</p>
              <p className="text-slate-500">No hay granjas bloqueadas en este momento</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left">
                      <input 
                        type="checkbox"
                        checked={selectedFarms.size === farms.length}
                        onChange={selectAll}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Granja
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Propietario
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Último Plan
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Bloqueada Desde
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Último Pago
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {farms.map((farm) => {
                    const isSelected = selectedFarms.has(farm.id)
                    
                    return (
                      <tr 
                        key={farm.id} 
                        className={`hover:bg-slate-50 ${isSelected ? 'bg-primary-50' : ''}`}
                      >
                        <td className="py-4 px-4">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(farm.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{farm.displayName || farm.name}</p>
                              <p className="text-xs text-slate-500">ID: {farm.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-900">{farm.ownerName || 'Sin nombre'}</p>
                              <p className="text-xs text-slate-500">{farm.ownerEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {farm.subscription?.plan ? PLAN_LABELS[farm.subscription.plan as SubscriptionPlan] || farm.subscription.plan : 'FREE'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="text-red-600 font-medium">
                              {formatDate(farm.blockedSince)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {formatDate(farm.lastPaymentDate)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Mail className="h-3 w-3" />
                              Notificar
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <CreditCard className="h-3 w-3" />
                              Extender
                            </Button>
                          </div>
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

      {/* Action Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Plantillas de Acción</CardTitle>
          <CardDescription>Acciones rápidas para gestionar granjas bloqueadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-xl border border-slate-200 hover:border-primary-200 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Recordatorio Amigable</h4>
                  <p className="text-xs text-slate-500">Email de recordatorio suave</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">Enviar</Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 hover:border-primary-200 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Extensión 7 Días</h4>
                  <p className="text-xs text-slate-500">Período de gracia adicional</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">Aplicar</Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 hover:border-primary-200 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Oferta Especial</h4>
                  <p className="text-xs text-slate-500">20% descuento para reactivar</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">Enviar Oferta</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


