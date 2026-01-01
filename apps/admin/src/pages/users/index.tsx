import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Usuarios</h1>
          <p className="text-neutral-600 mt-2">Gestiona los usuarios de la plataforma</p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-neutral-400">
            Tabla de usuarios (por implementar)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

