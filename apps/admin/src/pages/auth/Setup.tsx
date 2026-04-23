import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Shield, AlertCircle, Sparkles, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/shared/Logo"
import { useAuthStore } from "@/stores"

/**
 * Pantalla de "Setup inicial" del SaaS.
 *
 * Solo aparece cuando `hasAnyAdmin === false`. Permite crear el primer
 * SUPER_ADMIN. Una vez creado, el usuario es logueado automáticamente y
 * redirigido al dashboard.
 */
export function SetupPage() {
  const navigate = useNavigate()
  const { bootstrapFirstAdmin, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLocalError(null)

    if (password.length < 8) {
      setLocalError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (password !== confirmPassword) {
      setLocalError("Las contraseñas no coinciden")
      return
    }

    try {
      await bootstrapFirstAdmin(email, password, displayName)
      navigate("/dashboard")
    } catch {
      // error está en el store
    }
  }

  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-600 to-primary-800 p-10 text-white">
        <Logo variant="white" showBadge />

        <div className="space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
            <Sparkles className="h-3 w-3" />
            SETUP INICIAL
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Crea el primer administrador
          </h1>
          <p className="text-lg text-blue-100">
            Esta cuenta tendrá rol <strong>SUPER_ADMIN</strong> y podrá crear el resto del equipo
            de Gallinapp desde el panel.
          </p>

          <div className="space-y-3 pt-4 text-sm text-blue-100">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-0.5 shrink-0 text-blue-200" />
              <span>Acceso completo al panel admin y a todas las granjas del SaaS.</span>
            </div>
            <div className="flex items-start gap-3">
              <KeyRound className="h-5 w-5 mt-0.5 shrink-0 text-blue-200" />
              <span>Esta pantalla se desactiva automáticamente al crear la primera cuenta.</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} Gallinapp. Todos los derechos reservados.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col bg-slate-50">
        <div className="lg:hidden p-6 border-b border-slate-200 bg-white">
          <Logo showBadge />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-center text-2xl">Configuración inicial</CardTitle>
              <CardDescription className="text-center">
                No detectamos administradores en el sistema. Crea la primera cuenta para empezar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(error || localError) && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">No se pudo completar el setup</p>
                    <p className="mt-1 opacity-90">{localError ?? error?.message}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nombre completo</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Elvio Admin"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gallinapp.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={isLoading}
                    aria-invalid={passwordsDontMatch}
                  />
                  {passwordsDontMatch && (
                    <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  disabled={
                    !email ||
                    !password ||
                    !displayName ||
                    !confirmPassword ||
                    passwordsDontMatch ||
                    isLoading
                  }
                >
                  {isLoading ? "Creando administrador…" : "Crear primer administrador"}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Esta acción solo está disponible cuando no existen administradores. Una vez creado,
                este flujo se desactiva automáticamente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
