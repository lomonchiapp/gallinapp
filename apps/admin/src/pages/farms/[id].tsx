import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { 
  Loader2, ArrowLeft, Building2, Users, Egg, Drumstick, Bird, 
  Mail, Phone, MapPin, Globe, Calendar, Settings, CreditCard,
  CheckCircle, XCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  getFarmById, 
  getFarmMembers, 
  getFarmLotes,
  type FarmDetail,
  type FarmMember,
  type AdminLote,
  type TipoLote
} from "@/services/admin.service"

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
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

export function FarmDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [farm, setFarm] = useState<FarmDetail | null>(null)
  const [members, setMembers] = useState<FarmMember[]>([])
  const [lotes, setLotes] = useState<AdminLote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!id) return
      setIsLoading(true)
      try {
        const [farmData, membersData, lotesData] = await Promise.all([
          getFarmById(id),
          getFarmMembers(id),
          getFarmLotes(id),
        ])
        setFarm(farmData)
        setMembers(membersData)
        setLotes(lotesData)
      } catch (error) {
        console.error('Error loading farm:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

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
          <div className="flex items-center gap-2 text-slate-500">
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
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            farm.subscription?.plan?.toUpperCase() === 'PRO' 
              ? 'bg-primary-100 text-primary-700'
              : farm.subscription?.plan?.toUpperCase() === 'ENTERPRISE'
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-700'
          }`}>
            <CreditCard className="h-4 w-4 mr-1.5" />
            {farm.subscription?.plan || 'FREE'}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-500" />
              Información de la Granja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Farm Info */}
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

            {/* Dates */}
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

            {/* Settings Preview */}
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

        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              Miembros
            </CardTitle>
            <CardDescription>{members.length} miembros</CardDescription>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No hay miembros</p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.uid} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
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
      </div>

      {/* Lotes */}
      <Card>
        <CardHeader>
          <CardTitle>Lotes</CardTitle>
          <CardDescription>{lotes.length} lotes en esta granja</CardDescription>
        </CardHeader>
        <CardContent>
          {lotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Egg className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">Esta granja no tiene lotes</p>
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
                                {lote.cantidadActual} / {lote.cantidadInicial}
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
    </div>
  )
}
