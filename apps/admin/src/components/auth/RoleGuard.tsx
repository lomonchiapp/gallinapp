import { Link } from "react-router-dom"
import { ShieldOff } from "lucide-react"
import { useAuthStore } from "@/stores"
import type { GlobalRole } from "@/stores/authStore"
import { Button } from "@/components/ui/button"

interface RoleGuardProps {
  /** Roles que pueden acceder. Si el rol del usuario no está incluido, se muestra el fallback. */
  allowed: GlobalRole[]
  /** Contenido si tiene permiso. */
  children: React.ReactNode
  /** Si se quiere reemplazar el fallback por defecto (la pantalla "Sin acceso"). */
  fallback?: React.ReactNode
  /** Si es true, renderiza null en lugar del fallback (útil dentro de listas/sidebar). */
  silent?: boolean
}

/**
 * Wrapper que valida el rol global del admin actual antes de renderizar children.
 * Si no tiene permiso, muestra una pantalla con mensaje claro y link al dashboard.
 */
export function RoleGuard({ allowed, children, fallback, silent }: RoleGuardProps) {
  const admin = useAuthStore((s) => s.admin)
  const role = admin?.globalRole

  if (role && allowed.includes(role)) {
    return <>{children}</>
  }

  if (silent) return null
  if (fallback) return <>{fallback}</>

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <ShieldOff className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Acceso restringido</h2>
        <p className="max-w-md text-sm text-slate-500">
          Tu rol{role ? ` (${role})` : ''} no tiene permisos para ver esta sección. Si crees que es
          un error, contacta a un SUPER_ADMIN.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link to="/dashboard">Volver al dashboard</Link>
      </Button>
    </div>
  )
}
