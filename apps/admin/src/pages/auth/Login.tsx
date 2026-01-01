import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/shared/Logo'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo variant="line" height={40} />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Accede al panel de administración de Gallinapp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <Input type="email" placeholder="admin@gallinapp.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Contraseña</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full" size="lg">
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

