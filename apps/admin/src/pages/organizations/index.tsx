import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Organizaciones</h1>
          <p className="text-neutral-600 mt-2">Gestiona las organizaciones de la plataforma</p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Nueva Organización
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Organizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-neutral-400">
            Tabla de organizaciones (por implementar)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

