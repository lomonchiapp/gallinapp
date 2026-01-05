import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Search, Egg, Drumstick, Bird, MoreHorizontal, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAllLotes, getLotesCount, type AdminLote, type TipoLote } from "@/services/admin.service"

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const tipoConfig: Record<TipoLote, { label: string; icon: typeof Egg; color: string; bg: string }> = {
  ponedoras: { label: 'Ponedoras', icon: Egg, color: 'text-amber-600', bg: 'bg-amber-100' },
  engorde: { label: 'Engorde', icon: Drumstick, color: 'text-red-600', bg: 'bg-red-100' },
  levantes: { label: 'Levantes', icon: Bird, color: 'text-blue-600', bg: 'bg-blue-100' },
}

const estadoColors: Record<string, string> = {
  ACTIVO: 'bg-green-100 text-green-700',
  FINALIZADO: 'bg-slate-100 text-slate-700',
  CANCELADO: 'bg-red-100 text-red-700',
  VENDIDO: 'bg-blue-100 text-blue-700',
  TRANSFERIDO: 'bg-purple-100 text-purple-700',
}

export function LotesPage() {
  const [lotes, setLotes] = useState<AdminLote[]>([])
  const [counts, setCounts] = useState({ ponedoras: 0, engorde: 0, levantes: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<TipoLote | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [lotesData, countsData] = await Promise.all([
          getAllLotes(),
          getLotesCount(),
        ])
        setLotes(lotesData)
        setCounts(countsData)
      } catch (error) {
        console.error('Error loading lotes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredLotes = lotes.filter(lote => {
    if (filter !== 'all' && lote.tipo !== filter) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        lote.nombre.toLowerCase().includes(searchLower) ||
        lote.farmName?.toLowerCase().includes(searchLower) ||
        lote.raza.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lotes</h1>
          <p className="text-slate-500">Todos los lotes de todas las granjas</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Buscar lote..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card 
          className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Lotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{counts.total}</div>
          </CardContent>
        </Card>

        {(['ponedoras', 'engorde', 'levantes'] as TipoLote[]).map((tipo) => {
          const config = tipoConfig[tipo]
          const Icon = config.icon
          return (
            <Card 
              key={tipo}
              className={`cursor-pointer transition-all ${filter === tipo ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setFilter(tipo)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{config.label}</CardTitle>
                <div className={`h-8 w-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{counts[tipo]}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Lotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Lotes</CardTitle>
          <CardDescription>
            {filteredLotes.length} lotes {filter !== 'all' ? `de ${tipoConfig[filter].label}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredLotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Egg className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No hay lotes registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Lote
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Tipo
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Granja
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Cantidad
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Raza
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Estado
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Fecha Inicio
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLotes.map((lote) => {
                    const config = tipoConfig[lote.tipo]
                    const Icon = config.icon
                    return (
                      <tr key={`${lote.farmId}-${lote.tipo}-${lote.id}`} className="hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
                              <Icon className={`h-5 w-5 ${config.color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{lote.nombre}</p>
                              <p className="text-xs text-slate-500">ID: {lote.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link 
                            to={`/farms/${lote.farmId}`}
                            className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                          >
                            {lote.farmName || lote.farmId.slice(0, 8)}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <span className="font-medium text-slate-900">{lote.cantidadActual}</span>
                            <span className="text-slate-500"> / {lote.cantidadInicial}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {lote.raza || '—'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            estadoColors[lote.estado] || 'bg-slate-100 text-slate-700'
                          }`}>
                            {lote.estado}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {formatDate(lote.fechaInicio)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

