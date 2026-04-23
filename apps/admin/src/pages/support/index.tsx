import { useState } from "react"
import {
  Loader2, Search, Plus, MessageSquare, Clock, CheckCircle,
  AlertCircle, User, Building2, Calendar, ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

interface SupportTicket {
  id: string
  subject: string
  description: string
  userId: string
  userName: string
  userEmail: string
  userPhoto?: string
  farmId?: string
  farmName?: string
  priority: TicketPriority
  status: TicketStatus
  assignedTo?: string
  assignedName?: string
  createdAt: Date
  updatedAt: Date
  responseCount: number
}

const priorityColors: Record<TicketPriority, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
}

const statusColors: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
}

const statusIcons: Record<TicketStatus, React.ComponentType<{ className?: string }>> = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: CheckCircle,
}

// Mock data - replace with real API
const mockTickets: SupportTicket[] = [
  {
    id: '1',
    subject: 'No puedo registrar mortalidad',
    description: 'Cuando intento registrar mortalidad en mi lote de ponedoras, la app se cierra.',
    userId: 'user1',
    userName: 'Carlos Mendez',
    userEmail: 'carlos@granja.com',
    farmName: 'Granja El Sol',
    priority: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    responseCount: 0,
  },
  {
    id: '2',
    subject: 'Problema con facturación',
    description: 'Mi suscripción se renovó pero no tengo acceso a las funciones PRO.',
    userId: 'user2',
    userName: 'Maria Garcia',
    userEmail: 'maria@avicola.com',
    farmName: 'Avícola Santa Maria',
    priority: 'critical',
    status: 'in_progress',
    assignedTo: 'admin1',
    assignedName: 'Soporte Técnico',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 7200000),
    responseCount: 3,
  },
  {
    id: '3',
    subject: 'Cómo exportar reportes',
    description: 'Necesito exportar los reportes de producción del último mes.',
    userId: 'user3',
    userName: 'Pedro Lopez',
    userEmail: 'pedro@granjita.com',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'admin1',
    assignedName: 'Soporte Técnico',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    responseCount: 2,
  },
]

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

export function SupportPage() {
  const [tickets] = useState<SupportTicket[]>(mockTickets)
  const [isLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all')
  const [filterPriority] = useState<TicketPriority | 'all'>('all')

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: '2.5h',
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false
    if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.userName.toLowerCase().includes(searchLower) ||
        ticket.userEmail.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Soporte al Cliente</h1>
          <p className="text-slate-500">Gestiona tickets y consultas de usuarios</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.open}</div>
                <div className="text-sm text-slate-500">Abiertos</div>
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
                <div className="text-2xl font-bold text-slate-900">{stats.inProgress}</div>
                <div className="text-sm text-slate-500">En Progreso</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.resolved}</div>
                <div className="text-sm text-slate-500">Resueltos Hoy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.avgResponseTime}</div>
                <div className="text-sm text-slate-500">Tiempo Respuesta</div>
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
            placeholder="Buscar tickets..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'Todos' : 
               status === 'open' ? 'Abiertos' :
               status === 'in_progress' ? 'En Progreso' :
               status === 'resolved' ? 'Resueltos' : 'Cerrados'}
            </Button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>Lista de tickets de soporte ordenados por prioridad</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No hay tickets con este filtro</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const StatusIcon = statusIcons[ticket.status]
                return (
                  <div
                    key={ticket.id}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={ticket.userPhoto} />
                      <AvatarFallback>{ticket.userName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 truncate">{ticket.subject}</h4>
                          <p className="text-sm text-slate-500 truncate">{ticket.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                            {ticket.priority === 'critical' ? 'Crítico' :
                             ticket.priority === 'high' ? 'Alto' :
                             ticket.priority === 'medium' ? 'Medio' : 'Bajo'}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {ticket.status === 'open' ? 'Abierto' :
                             ticket.status === 'in_progress' ? 'En Progreso' :
                             ticket.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.userName}
                        </span>
                        {ticket.farmName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {ticket.farmName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTimeAgo(ticket.createdAt)}
                        </span>
                        {ticket.responseCount > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {ticket.responseCount} respuestas
                          </span>
                        )}
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
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


