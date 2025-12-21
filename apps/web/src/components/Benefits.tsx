import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Zap, DollarSign, Globe, ArrowRight, Sparkles, Award, Target } from "lucide-react"

const benefits = [
  {
    icon: TrendingUp,
    title: "Productividad Multiplicada",
    description: "Automatización inteligente que reduce el tiempo de registro manual en un 70% y libera a tu equipo para tareas estratégicas",
    metric: "70%",
    metricLabel: "Más eficiencia",
    iconBg: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Zap,
    title: "Precisión Absoluta",
    description: "Validaciones automáticas y cálculos precisos eliminan errores humanos y garantizan datos 100% confiables",
    metric: "99.9%",
    metricLabel: "Precisión",
    iconBg: "from-amber-500 to-amber-600"
  },
  {
    icon: DollarSign,
    title: "ROI Comprobado",
    description: "Análisis detallado de costos y ganancias que optimiza tus operaciones y maximiza la rentabilidad",
    metric: "+45%",
    metricLabel: "Rentabilidad",
    iconBg: "from-green-500 to-green-600"
  },
  {
    icon: Globe,
    title: "Movilidad Total",
    description: "Acceso desde cualquier dispositivo con sincronización en tiempo real. Tu granja siempre contigo",
    metric: "24/7",
    metricLabel: "Disponibilidad",
    iconBg: "from-blue-400 to-blue-500"
  }
]

const stats = [
  { value: "10K+", label: "Granjas activas" },
  { value: "50M+", label: "Aves gestionadas" },
  { value: "98%", label: "Satisfacción" },
  { value: "4.8/5", label: "Valoración" }
]

export function Benefits() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#345DAD' }}>
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-20 w-full py-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 mx-auto">
            <Award className="w-4 h-4 text-yellow-300 flex-shrink-0" />
            <span className="text-sm font-semibold text-white whitespace-nowrap">Resultados Comprobados</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-4 max-w-5xl mx-auto">
            Transforma tu operación avícola
            <br />
            <span className="text-yellow-300">con impacto medible</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 md:mb-12 px-4">
            Miles de productores confían en Gallinapp para llevar su negocio al siguiente nivel
          </p>

          {/* Stats bar */}
          <div className="flex justify-center items-center w-full mb-12 md:mb-16 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 text-center flex flex-col items-center justify-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="flex justify-center items-start w-full mb-12 md:mb-16 px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl w-full">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              
              return (
                <div
                  key={benefit.title}
                  className="group relative flex w-full"
                >
                  {/* Card */}
                  <div className="h-full w-full bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/20 flex flex-col">
                    {/* Icon with gradient */}
                    <div className="relative mb-4 md:mb-6 flex justify-center md:justify-start w-full">
                      <div className={`h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br ${benefit.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg md:text-xl font-bold text-secondary-500 mb-2 md:mb-3 group-hover:text-primary-600 transition-colors text-center md:text-left w-full">
                      {benefit.title}
                    </h3>
                    <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-4 md:mb-6 text-center md:text-left flex-grow w-full">
                      {benefit.description}
                    </p>

                    {/* Metric */}
                    <div className="pt-4 md:pt-6 border-t border-neutral-100 mt-auto w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="text-center md:text-left flex-1">
                          <div className="text-xl md:text-2xl font-bold text-primary-600">{benefit.metric}</div>
                          <div className="text-xs text-neutral-500 uppercase tracking-wider font-medium">{benefit.metricLabel}</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-500 transition-colors flex-shrink-0 ml-2">
                          <ArrowRight className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative px-4 sm:px-6 flex justify-center items-center w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-5xl w-full mx-auto">
            <div className="flex flex-col items-center justify-center text-center w-full py-7">
              <div className="flex justify-center items-center mb-4 md:mb-6 w-full">
                <Target className="h-10 w-10 md:h-12 md:w-12 text-yellow-300" />
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 max-w-3xl mx-auto w-full text-center">
                ¿Listo para optimizar tu producción?
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4 w-full text-center">
                Únete a miles de productores que ya están transformando su gestión avícola
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full">
                <button className="group px-6 md:px-8 py-3 md:py-4 bg-white text-primary-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                  <span>Comenzar Prueba Gratuita</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </button>
                <button className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all w-full sm:w-auto text-center">
                  Ver Demo en Vivo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

