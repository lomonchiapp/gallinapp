import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
        <p className="text-neutral-600 mt-2">Métricas y análisis de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-neutral-400">
              Gráficos de uso (por implementar)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Retención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-neutral-400">
              Análisis de retención (por implementar)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

