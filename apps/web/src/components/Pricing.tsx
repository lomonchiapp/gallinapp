import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown, Rocket } from "lucide-react"

const plans = [
  {
    name: "Gratuito",
    price: "$0",
    period: "por siempre",
    description: "Perfecto para empezar",
    icon: Zap,
    features: [
      "1 lote activo",
      "1 usuario",
      "Funciones básicas",
      "Registro de producción",
      "Control de gastos básico"
    ],
    cta: "Empezar gratis",
    popular: false,
    gradient: "from-neutral-400 to-neutral-500"
  },
  {
    name: "Básico",
    price: "$19.99",
    period: "por mes",
    description: "Para granjas pequeñas",
    icon: Rocket,
    features: [
      "5 lotes activos",
      "3 usuarios",
      "Analytics avanzados",
      "Reportes exportables",
      "Notificaciones push",
      "Soporte por email"
    ],
    cta: "Comenzar ahora",
    popular: true,
    gradient: "from-primary-500 to-primary-600"
  },
  {
    name: "Pro",
    price: "$49.99",
    period: "por mes",
    description: "Para granjas medianas",
    icon: Sparkles,
    features: [
      "50 lotes activos",
      "10 usuarios",
      "API de integración",
      "Multi-ubicación",
      "Reportes personalizados",
      "Soporte prioritario",
      "Análisis predictivo"
    ],
    cta: "Actualizar a Pro",
    popular: false,
    gradient: "from-modules-levantes to-modules-ponedoras"
  },
  {
    name: "Enterprise",
    price: "$99.99",
    period: "por mes",
    description: "Para grandes operaciones",
    icon: Crown,
    features: [
      "Lotes ilimitados",
      "Usuarios ilimitados",
      "Personalización completa",
      "Soporte 24/7",
      "Capacitación incluida",
      "Gestor de cuenta dedicado",
      "Integraciones personalizadas"
    ],
    cta: "Contactar ventas",
    popular: false,
    gradient: "from-secondary-500 to-secondary-600"
  }
]

export function Pricing() {
  return (
    <section id="precios" className="py-20 md:py-32 bg-gradient-to-b from-white via-primary-50/20 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-success-500 text-white border-0 shadow-md">
            Precios
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-500 mb-4 px-4">
            Planes que se adaptan a tu negocio
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
            Elige el plan perfecto para tu granja. Puedes cambiar o cancelar en cualquier momento.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4" style={{ paddingTop: '17px', paddingBottom: '17px', marginTop: '19px', marginBottom: '19px' }}>
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            
            return (
              <Card 
                key={plan.name} 
                className={`group relative transition-all duration-500 bg-white border-2 ${
                  isPopular 
                    ? 'border-primary-500 shadow-colored-lg scale-105 hover:scale-110' 
                    : 'border-neutral-200 hover:border-primary-300 hover:shadow-xl hover:-translate-y-2'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg px-4 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Más Popular
                    </Badge>
                  </div>
                )}
                
                {/* Header with gradient */}
                <CardHeader className={`relative overflow-hidden rounded-t-lg p-6 ${
                  isPopular 
                    ? 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700' 
                    : 'bg-gradient-to-br from-neutral-50 to-white'
                }`}>
                  {isPopular && (
                    <div className="absolute inset-0 bg-white/10"></div>
                  )}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className={`h-6 w-6 ${isPopular ? 'text-white' : 'text-white'}`} />
                    </div>
                    {isPopular && (
                      <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-yellow-300" />
                      </div>
                    )}
                  </div>
                  <CardTitle className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-secondary-500'}`}>
                    {plan.name}
                  </CardTitle>
                  <CardDescription className={`text-sm mb-4 ${isPopular ? 'text-white/90' : 'text-neutral-600'}`}>
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-secondary-500'}`}>
                      {plan.price}
                    </span>
                    <span className={isPopular ? 'text-white/80' : 'text-neutral-600'}>
                      /{plan.period}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isPopular ? 'bg-primary-100' : 'bg-success-100'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${
                            isPopular ? 'text-primary-600' : 'text-success-600'
                          }`} />
                        </div>
                        <span className="text-sm text-neutral-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className={`w-full h-12 font-semibold transition-all ${
                      isPopular 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-white border-2 border-neutral-300 hover:border-primary-500 hover:bg-primary-50 text-secondary-600'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

