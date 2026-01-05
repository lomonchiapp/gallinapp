import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Loader2, Search, Building2, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAdminStore } from "@/stores"

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const planColors: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-700',
  PRO: 'bg-primary-100 text-primary-700',
  ENTERPRISE: 'bg-green-100 text-green-700',
}

const statusColors: Record<string, string> = {
  active: 'text-green-600',
  inactive: 'text-red-600',
  suspended: 'text-yellow-600',
}

export function FarmsPage() {
  const { farms, isLoadingFarms, loadFarms } = useAdminStore()

  useEffect(() => {
    loadFarms()
  }, [loadFarms])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Granjas</h1>
          <p className="text-slate-500">Gestiona las granjas registradas en Gallinapp</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Buscar granja..." className="pl-9" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Granjas</CardTitle>
          <CardDescription>
            {farms.length} granjas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingFarms ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : farms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No hay granjas registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Granja
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Código
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Plan
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Estado
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Creada
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {farms.map((farm) => (
                    <tr key={farm.id} className="hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <Link to={`/farms/${farm.id}`} className="flex items-center gap-3 group">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors">
                            <Building2 className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
                              {farm.displayName || farm.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {farm.id.slice(0, 8)}...
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                          {farm.farmCode || '—'}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          planColors[farm.subscription?.plan?.toUpperCase() || 'FREE']
                        }`}>
                          {farm.subscription?.plan || 'FREE'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          {farm.isActive ? (
                            <>
                              <CheckCircle className={`h-4 w-4 ${statusColors['active']}`} />
                              <span className="text-sm text-green-600">Activa</span>
                            </>
                          ) : (
                            <>
                              <XCircle className={`h-4 w-4 ${statusColors['inactive']}`} />
                              <span className="text-sm text-red-600">Inactiva</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {formatDate(farm.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
