import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { 
  Loader2, ArrowLeft, Building2, Users, Egg, Drumstick, Bird, 
  Mail, Phone, MapPin, Globe, Calendar, Settings, CreditCard,
  CheckCircle, XCircle, Package, Wallet, ShoppingCart, FileText,
  BarChart3, Grid3X3, RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  getFarmById, 
  getFarmMembers, 
  getFarmLotes,
  getFarmGalpones,
  getFarmInventory,
  getFarmGastos,
  getFarmVentas,
  getFarmFacturas,
  getFarmStats,
  type FarmDetail,
  type FarmMember,
  type AdminLote,
  type AdminGalpon,
  type AdminInventoryItem,
  type AdminGasto,
  type AdminVenta,
  type AdminFactura,
  type FarmStats,
  type TipoLote
} from "@/services/admin.service"
import { PLAN_COLORS, PLAN_LABELS } from "@/types/subscription"

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  })
}

function formatCurrency(amount: number, currency = 'DOP'): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

const tipoConfig: Record<TipoLote, { label: string; icon: typeof Egg; color: string; bg: string }> = {
  ponedoras: { label: 'Ponedoras', icon: Egg, color: 'text-amber-600', bg: 'bg-amber-100' },
  engorde: { label: 'Engorde', icon: Drumstick, color: 'text-red-600', bg: 'bg-red-100' },
  levantes: { label: 'Levantes', icon: Bird, color: 'text-blue-600', bg: 'bg-blue-100' },
}

const estadoColors: Record<string, string> = {
  ACTIVO: 'bg-green-100 text-green-700',
  FINALIZADO: 'bg-slate-100 text-slate-700',
  CANCELADO: 'bg-red-100 text-red-700',
  VENDIDO: 'bg-blue-100 text-blue-700',
  TRANSFERIDO: 'bg-purple-100 text-purple-700',
}

const roleLabels: Record<string, string> = {
  OWNER: 'Propietario',
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  VIEWER: 'Visor',
  admin: 'Administrador',
  owner: 'Propietario',
  manager: 'Gerente',
  viewer: 'Visor',
  member: 'Miembro',
}

type TabId = 'overview' | 'lotes' | 'galpones' | 'inventory' | 'gastos' | 'ventas' | 'facturas' | 'members'

const tabs: { id: TabId; label: string; icon: typeof Building2 }[] = [
  { id: 'overview', label: 'Resumen', icon: BarChart3 },
  { id: 'lotes', label: 'Lotes', icon: Egg },
  { id: 'galpones', label: 'Galpones', icon: Grid3X3 },
  { id: 'inventory', label: 'Inventario', icon: Package },
  { id: 'gastos', label: 'Gastos', icon: Wallet },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  { id: 'facturas', label: 'Facturas', icon: FileText },
  { id: 'members', label: 'Miembros', icon: Users },
]

export function FarmDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [farm, setFarm] = useState<FarmDetail | null>(null)
  const [stats, setStats] = useState<FarmStats | null>(null)
  const [members, setMembers] = useState<FarmMember[]>([])
  const [lotes, setLotes] = useState<AdminLote[]>([])
  const [galpones, setGalpones] = useState<AdminGalpon[]>([])
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([])
  const [gastos, setGastos] = useState<AdminGasto[]>([])
  const [ventas, setVentas] = useState<AdminVenta[]>([])
  const [facturas, setFacturas] = useState<AdminFactura[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const [farmData, membersData, lotesData, statsData] = await Promise.all([
        getFarmById(id),
        getFarmMembers(id),
        getFarmLotes(id),
        getFarmStats(id),
      ])
      setFarm(farmData)
      setMembers(membersData)
      setLotes(lotesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading farm:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTabData = async (tab: TabId) => {
    if (!id) return
    setIsRefreshing(true)
    try {
      switch (tab) {
        case 'galpones':
          const galponesData = await getFarmGalpones(id)
          setGalpones(galponesData)
          break
        case 'inventory':
          const inventoryData = await getFarmInventory(id)
          setInventory(inventoryData)
          break
        case 'gastos':
          const gastosData = await getFarmGastos(id)
          setGastos(gastosData)
          break
        case 'ventas':
          const ventasData = await getFarmVentas(id)
          setVentas(ventasData)
          break
        case 'facturas':
          const facturasData = await getFarmFacturas(id)
          setFacturas(facturasData)
          break
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    if (id && ['galpones', 'inventory', 'gastos', 'ventas', 'facturas'].includes(activeTab)) {
      loadTabData(activeTab)
    }
  }, [activeTab, id])

  const lotesByType = {
    ponedoras: lotes.filter(l => l.tipo === 'ponedoras'),
    engorde: lotes.filter(l => l.tipo === 'engorde'),
    levantes: lotes.filter(l => l.tipo === 'levantes'),
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!farm) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Building2 className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Granja no encontrada</h2>
        <p className="text-slate-500 mb-4">La granja que buscas no existe o fue eliminada</p>
        <Link to="/farms">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Granjas
          </Button>
        </Link>
      </div>
    )
  }

  const planKey = (farm.subscription?.plan?.toUpperCase() || 'FREE') as keyof typeof PLAN_COLORS
  const planColors = PLAN_COLORS[planKey] || PLAN_COLORS.FREE
  const planLabel = PLAN_LABELS[planKey] || 'Colaborador'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/farms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {farm.displayName || farm.name}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>ID: {farm.id}</span>
            {farm.farmCode && (
              <>
                <span>•</span>
                <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">
                  {farm.farmCode}
                </code>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {farm.isActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              <CheckCircle className="h-4 w-4" />
              Activa
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
              <XCircle className="h-4 w-4" />
              Inactiva
            </span>
          )}
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${planColors.bg} ${planColors.text}`}>
            <CreditCard className="h-4 w-4" />
            {planLabel}
          </span>
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4 -mb-px overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {isRefreshing && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary-500 mr-2" />
          <span className="text-sm text-slate-500">Cargando...</span>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Egg className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalLotes ?? 0}</p>
                    <p className="text-xs text-slate-500">Lotes Totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Bird className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.avesActivas?.toLocaleString() ?? 0}</p>
                    <p className="text-xs text-slate-500">Aves Activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(stats?.totalVentas ?? 0)}</p>
                    <p className="text-xs text-slate-500">Total Ventas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(stats?.totalGastos ?? 0)}</p>
                    <p className="text-xs text-slate-500">Total Gastos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Info & Settings */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary-500" />
                  Información de la Granja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {farm.farmInfo && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {farm.farmInfo.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Dirección</p>
                          <p className="text-sm text-slate-900">{farm.farmInfo.address}</p>
                        </div>
                      </div>
                    )}
                    {farm.farmInfo.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Teléfono</p>
                          <p className="text-sm text-slate-900">{farm.farmInfo.phone}</p>
                        </div>
                      </div>
                    )}
                    {farm.farmInfo.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Email</p>
                          <p className="text-sm text-slate-900">{farm.farmInfo.email}</p>
                        </div>
                      </div>
                    )}
                    {farm.farmInfo.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Website</p>
                          <p className="text-sm text-slate-900">{farm.farmInfo.website}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Creada</p>
                      <p className="text-sm text-slate-900">{formatDate(farm.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Última actualización</p>
                      <p className="text-sm text-slate-900">{formatDate(farm.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {farm.settings && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3">Configuración</h4>
                      <div className="grid gap-3 sm:grid-cols-3 text-sm">
                        {farm.settings.defaultEggPrice && (
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Precio Huevo</p>
                            <p className="font-medium text-slate-900">RD$ {farm.settings.defaultEggPrice}</p>
                          </div>
                        )}
                        {farm.settings.defaultChickenPricePerPound && (
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Precio/Lb Pollo</p>
                            <p className="font-medium text-slate-900">RD$ {farm.settings.defaultChickenPricePerPound}</p>
                          </div>
                        )}
                        {farm.settings.eggsPerBox && (
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Huevos/Caja</p>
                            <p className="font-medium text-slate-900">{farm.settings.eggsPerBox}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Galpones</span>
                    <span className="font-medium">{stats?.totalGalpones ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Lotes Ponedoras</span>
                    <span className="font-medium">{stats?.lotesPonedoras ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Lotes Engorde</span>
                    <span className="font-medium">{stats?.lotesEngorde ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Lotes Levantes</span>
                    <span className="font-medium">{stats?.lotesLevantes ?? 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Facturas Emitidas</span>
                    <span className="font-medium">{stats?.totalFacturas ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Items Inventario</span>
                    <span className="font-medium">{stats?.inventarioItems ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Miembros</span>
                    <span className="font-medium">{members.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Lotes Tab */}
      {activeTab === 'lotes' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Lotes</CardTitle>
              <CardDescription>{lotes.length} lotes en esta granja</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData()}
              disabled={isLoading}
              className="shrink-0"
              aria-label="Refrescar lotes"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refrescar
            </Button>
          </CardHeader>
          <CardContent>
            {lotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Egg className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 mb-2">Esta granja no tiene lotes registrados</p>
                <p className="text-xs text-slate-400 mb-4">Los lotes se crean desde la app móvil (Ponedoras, Engorde, Levantes)</p>
                <Button variant="outline" size="sm" onClick={() => loadData()} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Volver a cargar
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {(['ponedoras', 'engorde', 'levantes'] as TipoLote[]).map((tipo) => {
                  const lotesDelTipo = lotesByType[tipo]
                  if (lotesDelTipo.length === 0) return null
                  
                  const config = tipoConfig[tipo]
                  const Icon = config.icon
                  
                  return (
                    <div key={tipo}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`h-8 w-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <h4 className="font-medium text-slate-900">{config.label}</h4>
                        <span className="text-sm text-slate-500">({lotesDelTipo.length})</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {lotesDelTipo.map((lote) => (
                          <div 
                            key={lote.id}
                            className="rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-slate-900">{lote.nombre}</h5>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                estadoColors[lote.estado] || 'bg-slate-100 text-slate-700'
                              }`}>
                                {lote.estado}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-slate-500">Cantidad</p>
                                <p className="font-medium text-slate-900">
                                  {lote.cantidadActual.toLocaleString()} / {lote.cantidadInicial.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Raza</p>
                                <p className="text-slate-900">{lote.raza || '—'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Galpones Tab */}
      {activeTab === 'galpones' && (
        <Card>
          <CardHeader>
            <CardTitle>Galpones</CardTitle>
            <CardDescription>{galpones.length} galpones registrados</CardDescription>
          </CardHeader>
          <CardContent>
            {galpones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Grid3X3 className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Esta granja no tiene galpones registrados</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galpones.map((galpon) => (
                  <div key={galpon.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-slate-900">{galpon.nombre}</h5>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        galpon.estado === 'activo' ? 'bg-green-100 text-green-700' :
                        galpon.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {galpon.estado}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tipo</span>
                        <span className="font-medium">{galpon.tipo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Capacidad</span>
                        <span className="font-medium">{galpon.capacidad.toLocaleString()}</span>
                      </div>
                      {galpon.ocupacion !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Ocupación</span>
                          <span className="font-medium">{galpon.ocupacion.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <Card>
          <CardHeader>
            <CardTitle>Inventario</CardTitle>
            <CardDescription>{inventory.length} artículos en inventario</CardDescription>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Esta granja no tiene artículos en inventario</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Artículo</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Categoría</th>
                      <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Cantidad</th>
                      <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Precio Unit.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900">{item.nombre}</p>
                          {item.ubicacion && <p className="text-xs text-slate-500">{item.ubicacion}</p>}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{item.categoria}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-medium ${
                            item.stockMinimo && item.cantidad <= item.stockMinimo ? 'text-red-600' : 'text-slate-900'
                          }`}>
                            {item.cantidad} {item.unidad}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-slate-600">
                          {item.precioUnitario ? formatCurrency(item.precioUnitario) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gastos Tab */}
      {activeTab === 'gastos' && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos</CardTitle>
            <CardDescription>
              {gastos.length} gastos • Total: {formatCurrency(gastos.reduce((sum, g) => sum + g.monto, 0))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gastos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Esta granja no tiene gastos registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Concepto</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Categoría</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Fecha</th>
                      <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gastos.map((gasto) => (
                      <tr key={gasto.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900">{gasto.concepto}</p>
                          {gasto.proveedor && <p className="text-xs text-slate-500">{gasto.proveedor}</p>}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{gasto.categoria}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{formatShortDate(gasto.fecha)}</td>
                        <td className="py-3 px-4 text-right font-medium text-red-600">
                          {formatCurrency(gasto.monto, gasto.moneda)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ventas Tab */}
      {activeTab === 'ventas' && (
        <Card>
          <CardHeader>
            <CardTitle>Ventas</CardTitle>
            <CardDescription>
              {ventas.length} ventas • Total: {formatCurrency(ventas.reduce((sum, v) => sum + v.total, 0))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ventas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Esta granja no tiene ventas registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Nº</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Cliente</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Fecha</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado</th>
                      <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ventas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {venta.numero || venta.id.slice(0, 8)}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {venta.cliente?.nombre || 'Cliente no registrado'}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{formatShortDate(venta.fecha)}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            venta.estado === 'pagada' ? 'bg-green-100 text-green-700' :
                            venta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                            venta.estado === 'anulada' ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {venta.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">
                          {formatCurrency(venta.total, venta.moneda)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Facturas Tab */}
      {activeTab === 'facturas' && (
        <Card>
          <CardHeader>
            <CardTitle>Facturas</CardTitle>
            <CardDescription>{facturas.length} facturas emitidas</CardDescription>
          </CardHeader>
          <CardContent>
            {facturas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Esta granja no tiene facturas emitidas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Número</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Cliente</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Tipo</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Fecha</th>
                      <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado</th>
                      <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {facturas.map((factura) => (
                      <tr key={factura.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {factura.numero || factura.ncf || factura.id.slice(0, 8)}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-slate-900">{factura.cliente.nombre}</p>
                          {factura.cliente.rnc && (
                            <p className="text-xs text-slate-500">RNC: {factura.cliente.rnc}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            {factura.tipo.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {formatShortDate(factura.fechaEmision)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            factura.estado === 'pagada' ? 'bg-green-100 text-green-700' :
                            factura.estado === 'emitida' ? 'bg-blue-100 text-blue-700' :
                            factura.estado === 'anulada' ? 'bg-red-100 text-red-700' :
                            factura.estado === 'vencida' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {factura.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-slate-900">
                          {formatCurrency(factura.total, factura.moneda)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              Miembros
            </CardTitle>
            <CardDescription>{members.length} miembros en esta granja</CardDescription>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No hay miembros</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <div key={member.uid} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.photoURL || undefined} />
                      <AvatarFallback>{member.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {member.displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{member.email}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${
                      member.role === 'OWNER' || member.role === 'owner' || member.role === 'ADMIN' || member.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {roleLabels[member.role] || member.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
