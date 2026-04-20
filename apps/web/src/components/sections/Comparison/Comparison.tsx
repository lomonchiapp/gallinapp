import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { Check, X, Sparkles, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

type FeatureValue = boolean | string | number

interface ComparisonFeature {
  name: string
  description?: string
  free: FeatureValue
  basic: FeatureValue
  pro: FeatureValue
  hacienda: FeatureValue
}

interface FeatureCategory {
  category: string
  features: ComparisonFeature[]
}

const comparisonData: FeatureCategory[] = [
  {
    category: "Gestión de Granjas",
    features: [
      { name: "Granjas propias", free: false, basic: "1", pro: "3", hacienda: "10" },
      { name: "Colaboradores", free: false, basic: "2", pro: "10", hacienda: "50" },
      { name: "Lotes por tipo", free: false, basic: "5", pro: "20", hacienda: "Ilimitado" },
      { name: "Almacenamiento", free: false, basic: "2 GB", pro: "10 GB", hacienda: "50 GB" },
      { name: "Unirse a granjas de otros", free: true, basic: true, pro: true, hacienda: true },
    ]
  },
  {
    category: "Registros y Control",
    features: [
      { name: "Registro de producción", description: "Huevos, peso, etc.", free: true, basic: true, pro: true, hacienda: true },
      { name: "Registro de mortalidad", free: true, basic: true, pro: true, hacienda: true },
      { name: "Gestión de galpones", free: false, basic: true, pro: true, hacienda: true },
      { name: "Cálculos de producción", free: false, basic: true, pro: true, hacienda: true },
      { name: "Cálculos de costos", free: false, basic: true, pro: true, hacienda: true },
    ]
  },
  {
    category: "Finanzas y Ventas",
    features: [
      { name: "Módulo de gastos", free: false, basic: true, pro: true, hacienda: true },
      { name: "Módulo de inventario", free: false, basic: false, pro: true, hacienda: true },
      { name: "Módulo de ventas", free: false, basic: false, pro: true, hacienda: true },
      { name: "Facturación electrónica", free: false, basic: false, pro: true, hacienda: true },
      { name: "Exportación de datos", free: false, basic: true, pro: true, hacienda: true },
    ]
  },
  {
    category: "Avanzado",
    features: [
      { name: "Acceso API", free: false, basic: false, pro: true, hacienda: true },
      { name: "Reportes personalizados", free: false, basic: false, pro: true, hacienda: true },
      { name: "Análisis predictivo (IA)", free: false, basic: false, pro: false, hacienda: true },
      { name: "Integraciones personalizadas", free: false, basic: false, pro: false, hacienda: true },
    ]
  },
  {
    category: "Soporte",
    features: [
      { name: "Centro de ayuda", free: true, basic: true, pro: true, hacienda: true },
      { name: "Soporte por email", free: false, basic: true, pro: true, hacienda: true },
      { name: "Soporte prioritario", free: false, basic: false, pro: true, hacienda: true },
      { name: "Soporte 24/7", free: false, basic: false, pro: false, hacienda: true },
      { name: "Gestor de cuenta dedicado", free: false, basic: false, pro: false, hacienda: true },
      { name: "Capacitación incluida", free: false, basic: false, pro: false, hacienda: true },
    ]
  },
]

const plans = [
  { id: "free", name: "Colaborador", price: "Gratis", color: "slate" },
  { id: "basic", name: "Básico", price: "$39.99/mes", color: "blue" },
  { id: "pro", name: "Gallinapp Pro", price: "$49.99/mes", color: "primary", popular: true },
  { id: "hacienda", name: "Hacienda", price: "$99.99/mes", color: "emerald" },
]

export function Comparison() {
  const navigate = useNavigate()

  const renderValue = (value: FeatureValue, planColor: string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className={cn("w-5 h-5", planColor === "primary" ? "text-primary-600" : "text-green-600")} />
      ) : (
        <X className="w-5 h-5 text-slate-300" />
      )
    }
    return <span className="font-semibold text-brand-dark">{value}</span>
  }

  return (
    <Section id="comparacion" background="canvas" padding="lg">
      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Comparativa detallada</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6">
            Compara los planes
          </h2>
          
          <p className="text-lg text-stripe-text">
            Encuentra el plan perfecto para tu granja. Todos los planes incluyen 14 días de prueba gratuita.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-4">
          <table className="w-full min-w-[800px]">
            {/* Header Row */}
            <thead>
              <tr>
                <th className="text-left p-4 w-[280px]"></th>
                {plans.map((plan) => (
                  <th 
                    key={plan.id}
                    className={cn(
                      "p-4 text-center relative",
                      plan.popular && "bg-primary-50 rounded-t-2xl"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wide shadow-lg">
                          Popular
                        </span>
                      </div>
                    )}
                    <div className="font-bold text-brand-dark text-lg mb-1">{plan.name}</div>
                    <div className={cn(
                      "text-2xl font-black",
                      plan.color === "primary" ? "text-primary-600" : 
                      plan.color === "emerald" ? "text-emerald-600" :
                      plan.color === "blue" ? "text-blue-600" : "text-slate-600"
                    )}>
                      {plan.price}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {comparisonData.map((category, catIndex) => (
                <>
                  {/* Category Header */}
                  <tr key={`cat-${catIndex}`}>
                    <td 
                      colSpan={5}
                      className="pt-8 pb-4 px-4"
                    >
                      <h3 className="text-sm font-bold text-stripe-muted uppercase tracking-widest">
                        {category.category}
                      </h3>
                    </td>
                  </tr>

                  {/* Features */}
                  {category.features.map((feature, featureIndex) => (
                    <tr 
                      key={`${catIndex}-${featureIndex}`}
                      className={cn(
                        "border-b border-stripe-border/50",
                        featureIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      )}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-brand-dark">{feature.name}</span>
                          {feature.description && (
                            <div className="group relative">
                              <Info className="w-4 h-4 text-slate-400 cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-brand-dark text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
                                {feature.description}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">{renderValue(feature.free, "slate")}</td>
                      <td className="p-4 text-center">{renderValue(feature.basic, "blue")}</td>
                      <td className={cn("p-4 text-center", plans[2].popular && "bg-primary-50/50")}>
                        {renderValue(feature.pro, "primary")}
                      </td>
                      <td className="p-4 text-center">{renderValue(feature.hacienda, "emerald")}</td>
                    </tr>
                  ))}
                </>
              ))}

              {/* CTA Row */}
              <tr>
                <td className="p-6"></td>
                {plans.map((plan) => (
                  <td 
                    key={plan.id}
                    className={cn(
                      "p-6 text-center",
                      plan.popular && "bg-primary-50 rounded-b-2xl"
                    )}
                  >
                    <Button
                      onClick={() => navigate(`/auth/signup?plan=${plan.id}`)}
                      className={cn(
                        "w-full h-12 rounded-xl font-bold transition-all group",
                        plan.popular
                          ? "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                          : plan.id === "hacienda"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-brand-dark hover:bg-brand-dark/90 text-white"
                      )}
                    >
                      {plan.id === "hacienda" ? "Contactar" : "Comenzar"}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Note */}
        <p className="text-center text-sm text-stripe-muted mt-6 lg:hidden">
          ← Desliza para ver todos los planes →
        </p>
      </Container>
    </Section>
  )
}
