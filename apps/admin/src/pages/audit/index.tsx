import { useState } from "react"
import {
  Loader2, Shield, Search, User, Building2, Calendar,
  CreditCard, Settings, UserPlus, UserMinus, Trash2, Edit, Eye,
  Download, RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type AuditAction = 
  | 'user_created' 
  | 'user_updated' 
  | 'user_deleted'
  | 'subscription_changed'
  | 'farm_created'
  | 'farm_updated'
  | 'farm_deleted'
  | 'admin_login'
  | 'settings_changed'
  | 'notification_sent'

interface AuditLog {
  id: string
  action: AuditAction
  adminId: string
  adminName: string
  adminEmail: string
  targetType: 'user' | 'farm' | 'subscription' | 'system'
  targetId?: string
  targetName?: string
  details: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

const actionLabels: Record<AuditAction, string> = {
  user_created: 'Usuario Creado',
  user_updated: 'Usuario Actualizado',
  user_deleted: 'Usuario Eliminado',
  subscription_changed: 'Suscripción Cambiada',
  farm_created: 'Granja Creada',
  farm_updated: 'Granja Actualizada',
  farm_deleted: 'Granja Eliminada',
  admin_login: 'Inicio de Sesión Admin',
  settings_changed: 'Configuración Cambiada',
  notification_sent: 'Notificación Enviada',
}

const actionIcons: Record<AuditAction, React.ComponentType<{ className?: string }>> = {
  user_created: UserPlus,
  user_updated: Edit,
  user_deleted: UserMinus,
  subscription_changed: CreditCard,
  farm_created: Building2,
  farm_updated: Edit,
  farm_deleted: Trash2,
  admin_login: Shield,
  settings_changed: Settings,
  notification_sent: Eye,
}

const actionColors: Record<AuditAction, string> = {
  user_created: 'bg-green-100 text-green-700',
  user_updated: 'bg-blue-100 text-blue-700',
  user_deleted: 'bg-red-100 text-red-700',
  subscription_changed: 'bg-amber-100 text-amber-700',
  farm_created: 'bg-emerald-100 text-emerald-700',
  farm_updated: 'bg-cyan-100 text-cyan-700',
  farm_deleted: 'bg-red-100 text-red-700',
  admin_login: 'bg-purple-100 text-purple-700',
  settings_changed: 'bg-slate-100 text-slate-700',
  notification_sent: 'bg-indigo-100 text-indigo-700',
}

// Mock data
const mockLogs: AuditLog[] = [
  {
    id: '1',
    action: 'subscription_changed',
    adminId: 'admin1',
    adminName: 'Admin Principal',
    adminEmail: 'admin@gallinapp.com',
    targetType: 'subscription',
    targetId: 'user123',
    targetName: 'Carlos Mendez',
    details: 'Cambio de plan FREE a PRO',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    action: 'admin_login',
    adminId: 'admin1',
    adminName: 'Admin Principal',
    adminEmail: 'admin@gallinapp.com',
    targetType: 'system',
    details: 'Inicio de sesión desde panel de administración',
    ipAddress: '192.168.1.100',
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    action: 'farm_updated',
    adminId: 'admin2',
    adminName: 'Soporte Técnico',
    adminEmail: 'soporte@gallinapp.com',
    targetType: 'farm',
    targetId: 'farm456',
    targetName: 'Granja El Sol',
    details: 'Activación manual de granja bloqueada',
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    action: 'notification_sent',
    adminId: 'admin1',
    adminName: 'Admin Principal',
    adminEmail: 'admin@gallinapp.com',
    targetType: 'system',
    details: 'Notificación masiva enviada a 150 usuarios',
    metadata: { recipients: 150, type: 'push' },
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: '5',
    action: 'user_deleted',
    adminId: 'admin1',
    adminName: 'Admin Principal',
    adminEmail: 'admin@gallinapp.com',
    targetType: 'user',
    targetId: 'user789',
    targetName: 'usuario_inactivo@test.com',
    details: 'Eliminación de cuenta inactiva por solicitud',
    timestamp: new Date(Date.now() - 259200000),
  },
]

function formatDateTime(date: Date): string {
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AuditPage() {
  const [logs] = useState<AuditLog[]>(mockLogs)
  const [isLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState<AuditAction | 'all'>('all')

  const filteredLogs = logs.filter(log => {
    if (filterAction !== 'all' && log.action !== filterAction) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        log.adminName.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower) ||
        log.targetName?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const stats = {
    total: logs.length,
    today: logs.filter(l => {
      const today = new Date()
      return l.timestamp.toDateString() === today.toDateString()
    }).length,
    subscriptionChanges: logs.filter(l => l.action === 'subscription_changed').length,
    adminLogins: logs.filter(l => l.action === 'admin_login').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary-500" />
            Auditoría del Sistema
          </h1>
          <p className="text-slate-500">Registro de todas las acciones administrativas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                <div className="text-sm text-slate-500">Total Registros</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.today}</div>
                <div className="text-sm text-slate-500">Hoy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.subscriptionChanges}</div>
                <div className="text-sm text-slate-500">Cambios de Plan</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.adminLogins}</div>
                <div className="text-sm text-slate-500">Logins Admin</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Buscar en registros..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value as AuditAction | 'all')}
          className="h-10 px-3 rounded-md border border-slate-200 text-sm"
        >
          <option value="all">Todas las acciones</option>
          {Object.entries(actionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividad</CardTitle>
          <CardDescription>
            {filteredLogs.length} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No hay registros con este filtro</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const ActionIcon = actionIcons[log.action]
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${actionColors[log.action].split(' ')[0]}`}>
                      <ActionIcon className={`h-5 w-5 ${actionColors[log.action].split(' ')[1]}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action]}`}>
                              {actionLabels[log.action]}
                            </span>
                            {log.targetName && (
                              <span className="text-sm text-slate-600">
                                → {log.targetName}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 mt-1">{log.details}</p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.adminName}
                        </span>
                        {log.ipAddress && (
                          <span className="font-mono">{log.ipAddress}</span>
                        )}
                      </div>
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


