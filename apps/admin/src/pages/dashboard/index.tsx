import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, CreditCard, TrendingUp } from 'lucide-react'

const stats = [
  { name: 'Organizaciones Activas', value: '1,234', icon: Building2, change: '+12%' },
  { name: 'Usuarios Totales', value: '5,678', icon: Users, change: '+8%' },
  { name: 'Suscripciones Activas', value: '890', icon: CreditCard, change: '+15%' },
  { name: 'Crecimiento Mensual', value: '23%', icon: TrendingUp, change: '+5%' },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2">Vista general de la plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600">
                  {stat.name}
                </CardTitle>
                <Icon className="h-5 w-5 text-neutral-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                <p className="text-xs text-success-500 mt-1">{stat.change} vs mes anterior</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-neutral-400">
              Gráfico de crecimiento
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Suscripciones por Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-neutral-400">
              Gráfico de suscripciones
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

