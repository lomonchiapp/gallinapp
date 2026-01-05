import { useState } from "react"
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface CreateUserData {
  email: string
  password: string
  displayName: string
  globalRole: string | null
  subscription: {
    plan: string
  }
}

export function CreateUserModal({ open, onOpenChange, onSuccess }: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    password: "",
    displayName: "",
    globalRole: null,
    subscription: { plan: "FREE" },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const createUser = httpsCallable(functions, "createUser")
      await createUser({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        globalRole: formData.globalRole || null,
        subscription: formData.subscription,
      })

      // Reset form
      setFormData({
        email: "",
        password: "",
        displayName: "",
        globalRole: null,
        subscription: { plan: "FREE" },
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      console.error("Error creating user:", err)
      const errorMessage = err instanceof Error ? err.message : "Error al crear usuario"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary-500" />
            Crear Usuario
          </DialogTitle>
          <DialogDescription>
            Crea un nuevo usuario para la plataforma Gallinapp. Los usuarios sin rol admin son clientes que usan la app móvil/web.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre completo</Label>
            <Input
              id="displayName"
              placeholder="Juan Pérez"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="globalRole">Tipo de usuario</Label>
              <Select
                value={formData.globalRole || "none"}
                onValueChange={(value) => 
                  setFormData({ ...formData, globalRole: value === "none" ? null : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cliente (app móvil/web)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">👤 Cliente (app móvil/web)</SelectItem>
                  <SelectItem value="ADMIN">🔐 Admin (acceso dashboard)</SelectItem>
                  <SelectItem value="SUPPORT">🎧 Soporte (acceso dashboard)</SelectItem>
                  <SelectItem value="ANALYST">📊 Analista (acceso dashboard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan de suscripción</Label>
              <Select
                value={formData.subscription.plan}
                onValueChange={(value) => 
                  setFormData({ ...formData, subscription: { plan: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Usuario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

