import { useState, useEffect, useRef } from "react"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { 
  Database, TrendingUp, BarChart3, ShieldCheck, Zap, Globe, 
  LayoutGrid, Receipt, Tags, FileText, Activity, Boxes, FileBarChart,
  ChevronLeft, ChevronRight, Sparkles, Check, ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    id: "caracteristicas",
    label: "Características",
    title: "Todo lo necesario para una gestión de clase mundial.",
    description: "Hemos construido las herramientas más potentes del sector para que puedas enfocarte en lo que realmente importa.",
    items: [
      {
        icon: Database,
        title: "Gestión Integral de Lotes",
        description: "Control centralizado de ponedoras, engorde y levante. Registra producción y mortalidad con un solo click.",
        color: "from-blue-500 to-blue-600",
        highlight: "Core",
      },
      {
        icon: TrendingUp,
        title: "Sistema Financiero Pro",
        description: "Facturación automática y control de gastos por categorías. Análisis de rentabilidad en tiempo real.",
        color: "from-green-500 to-emerald-600",
        highlight: "Pro",
      },
      {
        icon: BarChart3,
        title: "Business Intelligence",
        description: "Dashboards ejecutivos con métricas en tiempo real. Exporta reportes listos para decisiones.",
        color: "from-purple-500 to-violet-600",
        highlight: "Pro",
      },
      {
        icon: ShieldCheck,
        title: "Seguridad Bancaria",
        description: "Tus datos están protegidos con encriptación de grado militar y backups automáticos diarios.",
        color: "from-orange-500 to-amber-600",
        highlight: "Enterprise",
      },
      {
        icon: Zap,
        title: "Automatización Total",
        description: "Reduce el tiempo operativo en un 70%. Deja que Gallinapp haga el trabajo pesado por ti.",
        color: "from-yellow-500 to-orange-500",
        highlight: "Core",
      },
      {
        icon: Globe,
        title: "Multi-ubicación",
        description: "Gestiona múltiples granjas desde una única cuenta. Comparte accesos con tu equipo.",
        color: "from-indigo-500 to-blue-600",
        highlight: "Hacienda",
      },
    ]
  },
  {
    id: "modulos",
    label: "Módulos",
    title: "Módulos operativos diseñados para el día a día.",
    description: "Cada módulo está optimizado para flujos de trabajo específicos en la granja avícola moderna.",
    items: [
      {
        icon: LayoutGrid,
        title: "Mi Granja",
        description: "Gestión de lotes (Ponedoras, Levante, Engorde), mortalidad y costos unitarios detallados.",
        color: "from-sky-500 to-cyan-600",
        highlight: "Básico",
      },
      {
        icon: Receipt,
        title: "Gastos",
        description: "Registro de artículos (insumos, alimentos) e historial de inversiones por cada lote activo.",
        color: "from-emerald-500 to-teal-600",
        highlight: "Básico",
      },
      {
        icon: Tags,
        title: "Ventas",
        description: "Venta por unidades o lotes completos con débito automático de inventario sincronizado.",
        color: "from-amber-500 to-yellow-600",
        highlight: "Pro",
      },
      {
        icon: FileText,
        title: "Facturación",
        description: "Control de numeración, impuestos y emisión de comprobantes fiscales con estándares legales.",
        color: "from-rose-500 to-pink-600",
        highlight: "Pro",
      },
      {
        icon: Boxes,
        title: "Inventario",
        description: "Control de existencias de huevos, aves y productos con alertas de stock bajo.",
        color: "from-violet-500 to-purple-600",
        highlight: "Pro",
      },
      {
        icon: Activity,
        title: "Bienestar Animal",
        description: "Monitoreo de salud, alertas preventivas y registro de tratamientos por lote.",
        color: "from-red-500 to-rose-600",
        highlight: "Pro",
      },
    ]
  },
  {
    id: "funciones",
    label: "Avanzado",
    title: "Potencia tu granja con tecnología de vanguardia.",
    description: "Funciones avanzadas que utilizan IA y analítica para maximizar la rentabilidad de tu operación.",
    items: [
      {
        icon: Activity,
        title: "IA Predictiva",
        description: "Algoritmos que predicen producción, mortalidad y rentabilidad basados en datos históricos.",
        color: "from-cyan-500 to-blue-600",
        highlight: "Hacienda",
      },
      {
        icon: FileBarChart,
        title: "Reportes Ejecutivos",
        description: "Generación de reportes profesionales en PDF/Excel para bancos, socios e inversionistas.",
        color: "from-fuchsia-500 to-pink-600",
        highlight: "Pro",
      },
      {
        icon: Globe,
        title: "Multi-Granja",
        description: "Gestiona hasta 10 granjas desde un panel centralizado con datos consolidados.",
        color: "from-blue-600 to-indigo-700",
        highlight: "Hacienda",
      },
      {
        icon: Zap,
        title: "API de Integración",
        description: "Conecta Gallinapp con tu ERP, contabilidad o cualquier sistema externo.",
        color: "from-yellow-500 to-amber-600",
        highlight: "Pro",
      },
      {
        icon: ShieldCheck,
        title: "SLA Garantizado",
        description: "99.99% de disponibilidad con soporte dedicado 24/7 y gestor de cuenta personal.",
        color: "from-green-600 to-emerald-700",
        highlight: "Hacienda",
      },
      {
        icon: BarChart3,
        title: "Analytics Comparativo",
        description: "Compara rendimiento entre lotes, periodos y operarios para optimizar recursos.",
        color: "from-purple-600 to-violet-700",
        highlight: "Pro",
      },
    ]
  }
]

const highlightColors: Record<string, string> = {
  "Core": "bg-slate-100 text-slate-700",
  "Básico": "bg-blue-100 text-blue-700",
  "Pro": "bg-amber-100 text-amber-700",
  "Hacienda": "bg-emerald-100 text-emerald-700",
  "Enterprise": "bg-purple-100 text-purple-700",
}

export function Features() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSlideChange = (index: number) => {
    if (index === activeSlide) return
    setIsTransitioning(true)
    setVisibleCards([])
    setTimeout(() => {
      setActiveSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  useEffect(() => {
    // Staggered animation for cards
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        const items = SLIDES[activeSlide].items
        items.forEach((_, i) => {
          setTimeout(() => {
            setVisibleCards(prev => [...prev, i])
          }, i * 100)
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeSlide, isTransitioning])

  const nextSlide = () => handleSlideChange((activeSlide + 1) % SLIDES.length)
  const prevSlide = () => handleSlideChange((activeSlide - 1 + SLIDES.length) % SLIDES.length)

  const currentSlideData = SLIDES[activeSlide]

  return (
    <Section id="caracteristicas" background="white" padding="lg" className="overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <Container>
        {/* Header & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-amber-50 border border-primary-100 mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Plataforma Completa</span>
            </div>
            <h3 className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark leading-tight mb-6 transition-all duration-500",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
              {currentSlideData.title}
            </h3>
            <p className={cn(
              "text-lg text-stripe-text leading-relaxed transition-all duration-500 delay-100",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
              {currentSlideData.description}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl shadow-inner">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleSlideChange(index)}
                className={cn(
                  "relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                  activeSlide === index 
                    ? "bg-white text-brand-dark shadow-lg" 
                    : "text-stripe-muted hover:text-brand-dark hover:bg-white/50"
                )}
              >
                {slide.label}
                {activeSlide === index && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div 
          ref={containerRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentSlideData.items.map((item, i) => (
            <div 
              key={`${activeSlide}-${i}`}
              className={cn(
                "group relative p-8 rounded-3xl bg-white border-2 border-stripe-border transition-all duration-500",
                "hover:border-primary-200 hover:shadow-2xl hover:-translate-y-2",
                visibleCards.includes(i) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* Highlight Badge */}
              <div className={cn(
                "absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                highlightColors[item.highlight] || highlightColors["Core"]
              )}>
                {item.highlight}
              </div>

              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg",
                "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                item.color
              )}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Content */}
              <h4 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-primary-600 transition-colors">
                {item.title}
              </h4>
              
              <p className="text-stripe-text leading-relaxed">
                {item.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-center gap-4 mt-12 lg:hidden">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full border-2 border-stripe-border bg-white text-stripe-heading hover:border-primary-500 hover:text-primary-600 transition-all shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSlideChange(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  activeSlide === i ? "w-8 bg-primary-500" : "w-2 bg-stripe-border hover:bg-primary-300"
                )}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="p-3 rounded-full border-2 border-stripe-border bg-white text-stripe-heading hover:border-primary-500 hover:text-primary-600 transition-all shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-stripe-border">
          {[
            { value: "10K+", label: "Granjas activas", icon: LayoutGrid },
            { value: "500M+", label: "Registros procesados", icon: Database },
            { value: "99.9%", label: "Uptime garantizado", icon: ShieldCheck },
            { value: "70%", label: "Tiempo ahorrado", icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-3 group-hover:bg-primary-100 transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-brand-dark mb-1">{stat.value}</div>
              <div className="text-sm text-stripe-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
