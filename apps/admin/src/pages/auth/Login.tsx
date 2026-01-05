import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, AlertCircle, Shield, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/shared/Logo"
import { useAuthStore } from "@/stores"

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await signIn(email, password)
      navigate("/dashboard")
    } catch {
      // Error handled in store
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-primary-500 p-10 text-white">
        <Logo variant="white" showBadge />

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Panel de Administración
          </h1>
          <p className="text-lg text-blue-100 max-w-md">
            Gestiona granjas, usuarios y suscripciones de Gallinapp desde un único lugar.
          </p>

          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-blue-100">Acceso seguro</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Lock className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-blue-100">Solo admins</span>
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
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Bienvenido</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Error de autenticación</p>
                    <p className="mt-1 opacity-90">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
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

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  disabled={!email || !password}
                >
                  Iniciar Sesión
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Solo personal autorizado de Gallinapp
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="lg:hidden p-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          © {new Date().getFullYear()} Gallinapp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
