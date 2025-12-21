import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Shield, 
  Users, 
  DollarSign, 
  Bell, 
  Database,
  CheckCircle2,
  TrendingUp,
  Zap,
  Sparkles,
  ArrowRight,
  LineChart,
  Globe,
  Lock
} from "lucide-react"

const mainFeatures = [
  {
    icon: Database,
    title: "Gestión Integral de Lotes",
    description: "Control completo de ponedoras, engorde y levante desde una única plataforma centralizada. Registra producción, mortalidad y crecimiento con precisión.",
    badge: "Core",
    gradient: "from-primary-500 to-primary-600",
    bgColor: "#345DAD",
    stats: [
      { label: "Tipos de lote", value: "3+" },
      { label: "Tiempo ahorrado", value: "70%" }
    ]
  },
  {
    icon: DollarSign,
    title: "Sistema Financiero Empresarial",
    description: "Facturación automática, control de gastos por categorías, análisis de rentabilidad en tiempo real y proyecciones financieras.",
    badge: "Pro",
    gradient: "from-success-500 to-success-600",
    bgColor: "#2E7D32",
    stats: [
      { label: "Precisión", value: "99.9%" },
      { label: "Automatización", value: "100%" }
    ]
  },
  {
    icon: BarChart3,
    title: "Business Intelligence Avanzado",
    description: "Dashboard ejecutivo con métricas en tiempo real, visualizaciones interactivas y reportes exportables para decisiones basadas en datos.",
    badge: "Pro",
    gradient: "from-info-500 to-info-600",
    bgColor: "#2196F3",
    stats: [
      { label: "Métricas", value: "50+" },
      { label: "Reportes", value: "20+" }
    ]
  }
]

const secondaryFeatures = [
  {
    icon: Users,
    title: "Multi-Tenant Enterprise",
    description: "Arquitectura SaaS con aislamiento total de datos, gestión avanzada de usuarios y control de permisos granular.",
    badge: "Enterprise",
    color: "#5A75B8"
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Notificaciones automáticas basadas en IA, recordatorios predictivos y alertas personalizables por WhatsApp, Email y Push.",
    badge: "Core",
    color: "#FF9800"
  },
  {
    icon: Shield,
    title: "Seguridad de Nivel Bancario",
    description: "Encriptación end-to-end, autenticación multi-factor, cumplimiento GDPR y auditorías completas de seguridad.",
    badge: "Enterprise",
    color: "#35354C"
  },
  {
    icon: Globe,
    title: "Multi-ubicación",
    description: "Gestiona múltiples granjas desde una única cuenta. Sincronización en tiempo real entre todas tus ubicaciones.",
    badge: "Pro",
    color: "#2196F3"
  },
  {
    icon: LineChart,
    title: "Análisis Predictivo",
    description: "Machine Learning para predicciones de producción, alertas tempranas de problemas y optimización de recursos.",
    badge: "Pro",
    color: "#2E7D32"
  },
  {
    icon: Lock,
    title: "Backup Automático",
    description: "Respaldo automático en la nube cada 24 horas. Recuperación de datos en segundos. 99.99% de disponibilidad.",
    badge: "Core",
    color: "#345DAD"
  }
]

const highlights = [
  { icon: TrendingUp, text: "Aumenta productividad 70%", color: "#2E7D32" },
  { icon: CheckCircle2, text: "99.9% Uptime garantizado", color: "#345DAD" },
  { icon: Zap, text: "Deploy en menos de 5 minutos", color: "#FF9800" }
]

export function Features() {
  return (
    <section id="caracteristicas" className="relative pt-32 pb-32 md:pt-40 md:pb-40 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 overflow-hidden">
      {/* Animated Background decorations */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#345DAD' }}></div>
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-15" style={{ backgroundColor: '#2E7D32' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#2196F3' }}></div>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 max-w-7xl relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-24 px-6 md:px-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border-2 shadow-lg mb-8" style={{ borderColor: '#345DAD' }}>
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#345DAD' }}></div>
            <span className="text-sm font-bold" style={{ color: '#345DAD' }}>PLATAFORMA EMPRESARIAL</span>
            <Sparkles className="h-4 w-4" style={{ color: '#FFD700' }} />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight px-4" style={{ color: '#35354C' }}>
            La solución completa para
            <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10" style={{ color: '#345DAD' }}>gestión avícola profesional</span>
              <div className="absolute bottom-2 left-0 w-full h-4 opacity-20" style={{ backgroundColor: '#FFD700' }}></div>
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed mb-12 px-4">
            Tecnología de última generación diseñada para empresas que buscan excelencia operativa
          </p>
          
          {/* Highlights Bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-12 mb-16 px-6 md:px-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border-2 border-neutral-100 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: highlight.color }}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-bold" style={{ color: '#35354C' }}>{highlight.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Features - Hero Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 px-6 md:px-8 mt-8">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <div 
                key={feature.title} 
                className="group relative overflow-hidden rounded-3xl bg-white border-2 border-neutral-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 p-10 md:p-12"
              >
                {/* Gradient overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${feature.bgColor}05 0%, ${feature.bgColor}15 100%)`
                  }}
                ></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-10">
                    <div 
                      className="relative h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                      style={{ backgroundColor: feature.bgColor }}
                    >
                      <Icon className="h-10 w-10 text-white" />
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <Badge 
                      className="px-4 py-2 font-bold border-0 shadow-md text-sm"
                      style={{ backgroundColor: '#E8EBF5', color: '#345DAD' }}
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-5">
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-opacity-90 transition-colors" style={{ color: '#35354C' }}>
                      {feature.title}
                    </h3>
                    <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex gap-8 pt-8 mt-8 border-t-2 border-neutral-100">
                    {feature.stats.map((stat, idx) => (
                      <div key={idx} className="flex-1 space-y-2">
                        <div className="text-3xl md:text-4xl font-bold" style={{ color: feature.bgColor }}>
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider font-semibold">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="mt-8 flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: feature.bgColor }}>
                    <span>Explorar más</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Secondary Features - Modern Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 px-6 md:px-8 mt-12">
          {secondaryFeatures.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <div 
                key={feature.title}
                className="group relative p-10 md:p-12 rounded-2xl bg-white border-2 border-neutral-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div 
                    className="inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300"
                    style={{ backgroundColor: feature.color }}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Title and Badge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold leading-tight" style={{ color: '#35354C' }}>{feature.title}</h3>
                    <Badge 
                      variant="outline" 
                      className="text-xs font-semibold border-2 px-3 py-1"
                      style={{ borderColor: feature.color, color: feature.color }}
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  {/* Description */}
                  <p className="text-base text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative element */}
                <div className="absolute top-4 right-4 h-20 w-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: feature.color }}></div>
              </div>
            )
          })}
        </div>

        {/* Premium CTA */}
        <div className="mt-32 px-6 md:px-8">
          <div 
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center shadow-2xl"
            style={{ backgroundColor: '#345DAD' }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                ¿Listo para transformar tu gestión avícola?
              </h3>
              
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                Únete a miles de productores que ya están revolucionando su negocio con Gallinapp
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  className="group px-10 py-5 bg-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3"
                  style={{ color: '#345DAD' }}
                >
                  <span className="text-lg">Solicitar Demo Personalizada</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all text-lg">
                  Ver Casos de Éxito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

