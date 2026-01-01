import { useState, useEffect } from "react"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { 
  Database, TrendingUp, BarChart3, ShieldCheck, Zap, Globe, 
  LayoutGrid, Receipt, Tags, FileText, Activity, Boxes, FileBarChart,
  ChevronLeft, ChevronRight, Sparkles
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
        color: "bg-blue-500",
      },
      {
        icon: TrendingUp,
        title: "Sistema Financiero Pro",
        description: "Facturación automática y control de gastos por categorías. Análisis de rentabilidad en tiempo real.",
        color: "bg-green-500",
      },
      {
        icon: BarChart3,
        title: "Business Intelligence",
        description: "Dashboards ejecutivos con métricas en tiempo real. Exporta reportes listos para decisiones.",
        color: "bg-purple-500",
      },
      {
        icon: ShieldCheck,
        title: "Seguridad Bancaria",
        description: "Tus datos están protegidos con encriptación de grado militar y backups automáticos diarios.",
        color: "bg-orange-500",
      },
      {
        icon: Zap,
        title: "Automatización Total",
        description: "Reduce el tiempo operativo en un 70%. Deja que Gallinapp haga el trabajo pesado por ti.",
        color: "bg-yellow-500",
      },
      {
        icon: Globe,
        title: "Multi-ubicación",
        description: "Gestiona múltiples granjas desde una única cuenta. Comparte accesos con tu equipo.",
        color: "bg-indigo-500",
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
        color: "bg-sky-600",
      },
      {
        icon: Receipt,
        title: "Gastos",
        description: "Registro de artículos (insumos, alimentos) e historial de inversiones por cada lote activo.",
        color: "bg-emerald-600",
      },
      {
        icon: Tags,
        title: "Ventas",
        description: "Venta por unidades o lotes completos con débito automático de inventario sincronizado.",
        color: "bg-amber-600",
      },
      {
        icon: FileText,
        title: "Facturación",
        description: "Control de numeración, impuestos y emisión de comprobantes fiscales con estándares legales.",
        color: "bg-rose-600",
      },
    ]
  },
  {
    id: "funciones",
    label: "Funciones",
    title: "Potencia tu granja con tecnología de vanguardia.",
    description: "Funciones avanzadas que utilizan IA y analítica para maximizar la rentabilidad de tu operación.",
    items: [
      {
        icon: Activity,
        title: "Bienestar Animal",
        description: "Sistema de monitoreo y alertas de salud en tiempo real para prevenir brotes y estrés.",
        color: "bg-red-500",
      },
      {
        icon: Zap,
        title: "IA Predictiva",
        description: "Algoritmos avanzados para predecir producción de huevos, mortalidad y rentabilidad futura.",
        color: "bg-cyan-500",
      },
      {
        icon: Boxes,
        title: "Inventario Pro",
        description: "Control inteligente de suministros, alimentos y stock de productos finales con alertas.",
        color: "bg-violet-500",
      },
      {
        icon: BarChart3,
        title: "Analítica Pro",
        description: "Dashboards comparativos de rendimiento entre lotes, periodos y operarios específicos.",
        color: "bg-lime-600",
      },
      {
        icon: FileBarChart,
        title: "Reportes Ejecutivos",
        description: "Generación masiva de reportes profesionales en PDF y Excel para socios o bancos.",
        color: "bg-fuchsia-600",
      },
      {
        icon: Globe,
        title: "Multi-Granja",
        description: "Gestiona múltiples ubicaciones físicas y equipos de trabajo desde un panel centralizado.",
        color: "bg-blue-700",
      },
    ]
  }
]

export function Features() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSlideChange = (index: number) => {
    if (index === activeSlide) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  const nextSlide = () => handleSlideChange((activeSlide + 1) % SLIDES.length)
  const prevSlide = () => handleSlideChange((activeSlide - 1 + SLIDES.length) % SLIDES.length)

  const currentSlideData = SLIDES[activeSlide]

  return (
    <Section id="caracteristicas" background="white" padding="lg" className="overflow-hidden">
      <Container>
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" />
              Nuestra Plataforma
            </div>
            <h3 className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark leading-tight mb-6 transition-all duration-300",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
              {currentSlideData.title}
            </h3>
            <p className={cn(
              "text-lg text-stripe-text leading-relaxed transition-all duration-300 delay-75",
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
              {currentSlideData.description}
            </p>
          </div>

          {/* Slider Controls (Tabs) */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-stripe-canvas rounded-2xl border border-stripe-border">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => handleSlideChange(index)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                  activeSlide === index 
                    ? "bg-white text-brand-primary shadow-premium" 
                    : "text-stripe-muted hover:text-brand-dark"
                )}
              >
                {slide.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className={cn(
          "grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500",
          isTransitioning ? "opacity-0 scale-[0.98] blur-sm" : "opacity-100 scale-100 blur-0"
        )}>
          {currentSlideData.items.map((item, i) => (
            <div 
              key={`${activeSlide}-${i}`}
              className="group p-8 rounded-[2rem] border border-stripe-border bg-white transition-all duration-300 hover:shadow-floating hover:-translate-y-1"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:scale-110 duration-300",
                item.color
              )}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              
              <h4 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">
                {item.title}
              </h4>
              
              <p className="text-stripe-text leading-relaxed text-sm md:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-center gap-4 mt-16 md:hidden">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full border border-stripe-border bg-white text-stripe-heading hover:bg-brand-primary hover:text-white transition-all shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeSlide === i ? "w-8 bg-brand-primary" : "w-2 bg-stripe-border"
                )}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="p-3 rounded-full border border-stripe-border bg-white text-stripe-heading hover:bg-brand-primary hover:text-white transition-all shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Container>
    </Section>
  )
}
