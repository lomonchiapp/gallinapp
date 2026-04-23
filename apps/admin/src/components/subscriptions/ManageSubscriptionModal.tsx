import { useState, useEffect } from "react"
import { Loader2, Crown, Calendar, History, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  updateUserSubscription,
  extendSubscription,
  cancelUserSubscription,
  getUserSubscriptionHistory,
  calculateEndDate,
  type UserWithSubscription,
  type SubscriptionHistory,
} from "@/services/admin.service"
import {
  type SubscriptionPlan,
  type SubscriptionStatus,
  type SubscriptionPeriod,
  PLAN_LABELS,
  PLAN_COLORS,
  PLAN_PRICES,
  STATUS_COLORS,
} from "@/types/subscription"

interface ManageSubscriptionModalProps {
  user: UserWithSubscription | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  adminInfo: { uid: string; email: string }
}

type TabType = 'edit' | 'extend' | 'cancel' | 'history'

export function ManageSubscriptionModal({
  user,
  open,
  onOpenChange,
  onSuccess,
  adminInfo,
}: ManageSubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('edit')
  const [history, setHistory] = useState<SubscriptionHistory[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Form state para edición
  const [plan, setPlan] = useState<SubscriptionPlan>('FREE')
  const [status, setStatus] = useState<SubscriptionStatus>('active')
  const [period, setPeriod] = useState<SubscriptionPeriod>('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')

  // Form state para extensión
  const [extensionDays, setExtensionDays] = useState(30)
  const [extensionReason, setExtensionReason] = useState('')

  // Form state para cancelación
  const [cancelReason, setCancelReason] = useState('')
  const [immediateCancel, setImmediateCancel] = useState(false)

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (user && open) {
      const userPlan = (user.subscription?.plan?.toUpperCase() || 'FREE') as SubscriptionPlan
      setPlan(userPlan)
      setStatus(user.subscription?.status || 'inactive')
      setPeriod(user.subscription?.period || 'monthly')
      setStartDate(user.subscription?.startDate 
        ? new Date(user.subscription.startDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]
      )
      setEndDate(user.subscription?.endDate 
        ? new Date(user.subscription.endDate).toISOString().split('T')[0] 
        : ''
      )
      setNotes('')
      setReason('')
      setError(null)
      setSuccess(null)
    }
  }, [user, open])

  // Cargar historial cuando se selecciona esa tab
  useEffect(() => {
    if (activeTab === 'history' && user) {
      loadHistory()
    }
  }, [activeTab, user])

  async function loadHistory() {
    if (!user) return
    setIsLoadingHistory(true)
    try {
      const data = await getUserSubscriptionHistory(user.uid)
      setHistory(data)
    } catch (err) {
      console.error('Error loading history:', err)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Calcular automáticamente fecha de fin cuando cambia periodo o fecha inicio
  function handlePeriodChange(newPeriod: SubscriptionPeriod) {
    setPeriod(newPeriod)
    if (startDate && plan !== 'FREE') {
      const start = new Date(startDate)
      const end = calculateEndDate(start, newPeriod)
      setEndDate(end.toISOString().split('T')[0])
    }
  }

  function handleStartDateChange(newStartDate: string) {
    setStartDate(newStartDate)
    if (newStartDate && plan !== 'FREE') {
      const start = new Date(newStartDate)
      const end = calculateEndDate(start, period)
      setEndDate(end.toISOString().split('T')[0])
    }
  }

  async function handleSaveChanges() {
    if (!user) return
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updateUserSubscription(
        user.uid,
        {
          plan,
          status,
          period: plan !== 'FREE' ? period : undefined,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          notes,
        },
        adminInfo,
        reason
      )
      setSuccess('Suscripción actualizada correctamente')
      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
      }, 1500)
    } catch (err) {
      console.error('Error updating subscription:', err)
      setError(err instanceof Error ? err.message : 'Error al actualizar suscripción')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExtend() {
    if (!user) return
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await extendSubscription(user.uid, extensionDays, adminInfo, extensionReason)
      setSuccess(`Suscripción extendida ${extensionDays} días`)
      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
      }, 1500)
    } catch (err) {
      console.error('Error extending subscription:', err)
      setError(err instanceof Error ? err.message : 'Error al extender suscripción')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCancel() {
    if (!user) return
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await cancelUserSubscription(user.uid, adminInfo, cancelReason, immediateCancel)
      setSuccess(immediateCancel ? 'Suscripción cancelada inmediatamente' : 'Suscripción marcada para cancelar al final del periodo')
      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
      }, 1500)
    } catch (err) {
      console.error('Error cancelling subscription:', err)
      setError(err instanceof Error ? err.message : 'Error al cancelar suscripción')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  const currentPlan = (user.subscription?.plan?.toUpperCase() || 'FREE') as SubscriptionPlan
  const currentColors = PLAN_COLORS[currentPlan]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary-500" />
            Gestionar Suscripción
          </DialogTitle>
          <DialogDescription>
            {user.displayName || user.email} — Plan actual:{' '}
            <span className={`font-medium ${currentColors.text}`}>
              {PLAN_LABELS[currentPlan]}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'edit', label: 'Editar Plan', icon: Crown },
            { id: 'extend', label: 'Extender', icon: Calendar },
            { id: 'cancel', label: 'Cancelar', icon: AlertTriangle },
            { id: 'history', label: 'Historial', icon: History },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Tab: Editar Plan */}
        {activeTab === 'edit' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={plan} onValueChange={(v) => setPlan(v as SubscriptionPlan)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['FREE', 'BASIC', 'PRO', 'HACIENDA'] as SubscriptionPlan[]).map(p => (
                      <SelectItem key={p} value={p}>
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${PLAN_COLORS[p].bg}`} />
                          {PLAN_LABELS[p]}
                          {p !== 'FREE' && (
                            <span className="text-xs text-slate-400">
                              ${PLAN_PRICES[p as Exclude<SubscriptionPlan, 'FREE'>].monthly}/mes
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as SubscriptionStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['active', 'inactive', 'trialing', 'past_due', 'cancelled'] as SubscriptionStatus[]).map(s => (
                      <SelectItem key={s} value={s}>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${STATUS_COLORS[s]}`}>
                          {s}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {plan !== 'FREE' && (
              <>
                <div className="space-y-2">
                  <Label>Periodo de facturación</Label>
                  <Select value={period} onValueChange={(v) => handlePeriodChange(v as SubscriptionPeriod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de inicio</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de vencimiento</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <Label>Razón del cambio</Label>
              <Input
                placeholder="ej: Promoción especial, ajuste de plan, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notas internas (opcional)</Label>
              <Textarea
                placeholder="Notas visibles solo para admins..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Tab: Extender */}
        {activeTab === 'extend' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <h4 className="font-medium text-blue-900 mb-1">Extender Suscripción</h4>
              <p className="text-sm text-blue-700">
                Agrega días adicionales a la suscripción actual del usuario.
                {user.subscription?.endDate && (
                  <>
                    {' '}Vence actualmente el{' '}
                    <strong>{new Date(user.subscription.endDate).toLocaleDateString()}</strong>.
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Días a agregar</Label>
              <div className="flex gap-2">
                {[7, 15, 30, 60, 90, 365].map(days => (
                  <Button
                    key={days}
                    variant={extensionDays === days ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExtensionDays(days)}
                  >
                    {days} días
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min={1}
                max={365}
                value={extensionDays}
                onChange={(e) => setExtensionDays(parseInt(e.target.value) || 30)}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Razón de la extensión</Label>
              <Textarea
                placeholder="ej: Compensación por problema técnico, cortesía, etc."
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button onClick={handleExtend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Extender {extensionDays} días
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Tab: Cancelar */}
        {activeTab === 'cancel' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <h4 className="font-medium text-red-900 mb-1 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Cancelar Suscripción
              </h4>
              <p className="text-sm text-red-700">
                Esta acción cancelará la suscripción del usuario. Puedes elegir cancelarla
                inmediatamente o al final del periodo actual.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Tipo de cancelación</Label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="cancelType"
                    checked={!immediateCancel}
                    onChange={() => setImmediateCancel(false)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-slate-900">Al final del periodo</p>
                    <p className="text-sm text-slate-500">
                      El usuario mantiene acceso hasta que termine su periodo actual
                      {user.subscription?.endDate && (
                        <> ({new Date(user.subscription.endDate).toLocaleDateString()})</>
                      )}
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border border-red-200 rounded-lg cursor-pointer hover:bg-red-50">
                  <input
                    type="radio"
                    name="cancelType"
                    checked={immediateCancel}
                    onChange={() => setImmediateCancel(true)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-red-900">Cancelación inmediata</p>
                    <p className="text-sm text-red-700">
                      El usuario pierde acceso inmediatamente y pasa a plan FREE
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Razón de la cancelación</Label>
              <Textarea
                placeholder="ej: Solicitud del usuario, incumplimiento de términos, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Volver
              </Button>
              <Button 
                onClick={handleCancel} 
                disabled={isLoading}
                variant="destructive"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {immediateCancel ? 'Cancelar Ahora' : 'Cancelar al Final del Periodo'}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Tab: Historial */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <h4 className="font-medium text-slate-900 mb-1 flex items-center gap-2">
                <History className="h-4 w-4" />
                Historial de Cambios
              </h4>
              <p className="text-sm text-slate-600">
                Registro de todos los cambios realizados en la suscripción de este usuario.
              </p>
            </div>

            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No hay cambios registrados
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {history.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${PLAN_COLORS[item.previousPlan]?.bg || 'bg-slate-100'} ${PLAN_COLORS[item.previousPlan]?.text || 'text-slate-700'}`}>
                          {PLAN_LABELS[item.previousPlan] || item.previousPlan}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${PLAN_COLORS[item.newPlan]?.bg || 'bg-slate-100'} ${PLAN_COLORS[item.newPlan]?.text || 'text-slate-700'}`}>
                          {PLAN_LABELS[item.newPlan] || item.newPlan}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {item.createdAt.toLocaleDateString()} {item.createdAt.toLocaleTimeString()}
                      </span>
                    </div>
                    {item.reason && (
                      <p className="text-slate-600 mb-1">{item.reason}</p>
                    )}
                    <p className="text-xs text-slate-400">
                      Por: {item.changedByEmail}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
