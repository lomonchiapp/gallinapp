import { Card, CardContent } from "@/components/ui/card"

const screenshots = [
  {
    title: "Dashboard Principal",
    description: "Vista general de tu granja con métricas clave",
    image: "📊"
  },
  {
    title: "Gestión de Lotes",
    description: "Control completo de ponedoras, engorde y levante",
    image: "🐓"
  },
  {
    title: "Análisis Financiero",
    description: "Reportes detallados de ventas y gastos",
    image: "💰"
  },
  {
    title: "Notificaciones",
    description: "Alertas inteligentes para mantenerte informado",
    image: "🔔"
  }
]

export function Gallery() {
  const screenshotGradients = [
    'from-primary-500 to-primary-700',
    'from-modules-levantes to-modules-ponedoras',
    'from-success-500 to-success-700',
    'from-info-500 to-info-700',
  ]
  
  return (
    <section id="galeria" className="py-20 md:py-32 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-500 mb-4">
            Descubre la app
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Interfaz intuitiva diseñada para productores avícolas profesionales
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {screenshots.map((screenshot, index) => {
            const gradient = screenshotGradients[index % screenshotGradients.length]
            
            return (
              <Card key={screenshot.title} className="overflow-hidden border-neutral-200 hover:shadow-colored transition-all hover:scale-105 bg-white">
                <CardContent className="p-0">
                  <div className={`aspect-[9/19] bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="text-6xl relative z-10">{screenshot.image}</div>
                  </div>
                  <div className="p-5 bg-gradient-card">
                    <h3 className="font-semibold text-secondary-500 mb-2">
                      {screenshot.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {screenshot.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

