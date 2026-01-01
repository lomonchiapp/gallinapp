import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Suscripciones</h1>
        <p className="text-neutral-600 mt-2">Gestiona las suscripciones y planes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Suscripciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-neutral-400">
            Tabla de suscripciones (por implementar)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

