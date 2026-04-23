import { useState } from "react"
import {
  Bell, Send, Users, CreditCard, Calendar, Clock,
  Smartphone, Globe, Loader2, CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PLAN_LABELS, type SubscriptionPlan } from "@/types/subscription"

interface PushCampaign {
  id: string
  title: string
  body: string
  targetSegment: string
  sentAt?: Date
  scheduledAt?: Date
  stats: {
    sent: number
    delivered: number
    opened: number
  }
  status: 'draft' | 'scheduled' | 'sent'
}

const mockCampaigns: PushCampaign[] = [
  {
    id: '1',
    title: '¡Nueva función disponible!',
    body: 'Ahora puedes exportar reportes en PDF. Descubre cómo en la app.',
    targetSegment: 'Todos los usuarios',
    sentAt: new Date(Date.now() - 86400000),
    stats: { sent: 1250, delivered: 1180, opened: 456 },
    status: 'sent',
  },
  {
    id: '2',
    title: 'Recordatorio: Tu trial termina pronto',
    body: 'Aprovecha un 20% de descuento si actualizas antes del viernes.',
    targetSegment: 'Usuarios en trial',
    scheduledAt: new Date(Date.now() + 86400000),
    stats: { sent: 0, delivered: 0, opened: 0 },
    status: 'scheduled',
  },
]

export function PushNotificationsPage() {
  const [campaigns] = useState<PushCampaign[]>(mockCampaigns)
  const [isCreating, setIsCreating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [segment, setSegment] = useState<'all' | 'plan' | 'inactive' | 'trial'>('all')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('FREE')
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now')
  const [scheduledDate, setScheduledDate] = useState('')

  const handleSend = async () => {
    setIsSending(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    setIsCreating(false)
    // Reset form
    setTitle('')
    setBody('')
    setSegment('all')
  }

  const stats = {
    totalSent: campaigns.reduce((acc, c) => acc + c.stats.sent, 0),
    avgOpenRate: campaigns.length > 0 
      ? Math.round(campaigns.reduce((acc, c) => {
          if (c.stats.sent === 0) return acc
          return acc + (c.stats.opened / c.stats.sent) * 100
        }, 0) / campaigns.filter(c => c.stats.sent > 0).length)
      : 0,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary-500" />
            Notificaciones Push
          </h1>
          <p className="text-slate-500">Envía notificaciones masivas a tus usuarios</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Send className="h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <Send className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalSent.toLocaleString()}</div>
                <div className="text-sm text-slate-500">Enviadas Total</div>
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
                <div className="text-2xl font-bold text-slate-900">{stats.avgOpenRate}%</div>
                <div className="text-sm text-slate-500">Tasa de Apertura</div>
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
                <div className="text-2xl font-bold text-slate-900">{stats.scheduled}</div>
                <div className="text-sm text-slate-500">Programadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{campaigns.length}</div>
                <div className="text-sm text-slate-500">Campañas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Modal/Card */}
      {isCreating && (
        <Card className="border-2 border-primary-200 bg-primary-50/30">
          <CardHeader>
            <CardTitle>Nueva Campaña Push</CardTitle>
            <CardDescription>Configura y envía una notificación masiva</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Título</label>
                <Input 
                  placeholder="Título de la notificación"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-slate-500">{title.length}/50 caracteres</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mensaje</label>
                <Textarea 
                  placeholder="Contenido del mensaje"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={150}
                  rows={3}
                />
                <p className="text-xs text-slate-500">{body.length}/150 caracteres</p>
              </div>
            </div>

            {/* Segment */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Segmento de Usuarios</label>
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { id: 'all', label: 'Todos', icon: Globe, desc: 'Todos los usuarios' },
                  { id: 'plan', label: 'Por Plan', icon: CreditCard, desc: 'Usuarios de un plan específico' },
                  { id: 'inactive', label: 'Inactivos', icon: Users, desc: 'Sin actividad 30+ días' },
                  { id: 'trial', label: 'En Trial', icon: Clock, desc: 'Período de prueba' },
                ].map((seg) => (
                  <button
                    key={seg.id}
                    onClick={() => setSegment(seg.id as typeof segment)}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      segment === seg.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-slate-200 hover:border-primary-200'
                    }`}
                  >
                    <seg.icon className={`h-5 w-5 mb-2 ${segment === seg.id ? 'text-primary-600' : 'text-slate-400'}`} />
                    <div className="font-medium text-slate-900">{seg.label}</div>
                    <div className="text-xs text-slate-500">{seg.desc}</div>
                  </button>
                ))}
              </div>

              {segment === 'plan' && (
                <div className="flex gap-2 mt-3">
                  {(['FREE', 'BASIC', 'PRO', 'HACIENDA'] as SubscriptionPlan[]).map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPlan === plan
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {PLAN_LABELS[plan]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Programación</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setScheduleType('now')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    scheduleType === 'now'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 hover:border-primary-200'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  Enviar ahora
                </button>
                <button
                  onClick={() => setScheduleType('scheduled')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    scheduleType === 'scheduled'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 hover:border-primary-200'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Programar
                </button>
              </div>

              {scheduleType === 'scheduled' && (
                <Input 
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="max-w-xs"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={!title || !body || isSending}
                className="gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {scheduleType === 'now' ? 'Enviar Ahora' : 'Programar'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Campañas</CardTitle>
          <CardDescription>Campañas enviadas y programadas</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No hay campañas aún</p>
              <Button className="mt-4" onClick={() => setIsCreating(true)}>
                Crear primera campaña
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    campaign.status === 'sent' 
                      ? 'bg-green-100' 
                      : campaign.status === 'scheduled' 
                      ? 'bg-amber-100' 
                      : 'bg-slate-100'
                  }`}>
                    {campaign.status === 'sent' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : campaign.status === 'scheduled' ? (
                      <Clock className="h-5 w-5 text-amber-600" />
                    ) : (
                      <Bell className="h-5 w-5 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900">{campaign.title}</h4>
                        <p className="text-sm text-slate-500">{campaign.body}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'sent' 
                          ? 'bg-green-100 text-green-700'
                          : campaign.status === 'scheduled'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {campaign.status === 'sent' ? 'Enviada' : 
                         campaign.status === 'scheduled' ? 'Programada' : 'Borrador'}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <span className="text-slate-500">
                        <Users className="h-4 w-4 inline mr-1" />
                        {campaign.targetSegment}
                      </span>
                      
                      {campaign.status === 'sent' && (
                        <>
                          <span className="text-slate-600">
                            <strong>{campaign.stats.sent.toLocaleString()}</strong> enviadas
                          </span>
                          <span className="text-green-600">
                            <strong>{Math.round((campaign.stats.opened / campaign.stats.sent) * 100)}%</strong> apertura
                          </span>
                        </>
                      )}
                      
                      {campaign.status === 'scheduled' && campaign.scheduledAt && (
                        <span className="text-amber-600">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {campaign.scheduledAt.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


