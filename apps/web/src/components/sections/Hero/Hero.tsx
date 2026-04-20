import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play, Sparkles, Shield, Zap, Check } from "lucide-react"
import {
  PhoneFrame,
  DashboardMockup,
  PonedorasMockup,
  EngordeMockup,
  VentasMockup,
} from "@/components/mockups"

// Los mockups que rotan en el hero — todos provienen de la app mobile real.
const HERO_SCREENS = [
  { key: "dashboard", label: "Inicio", Component: DashboardMockup },
  { key: "ponedoras", label: "Ponedoras", Component: PonedorasMockup },
  { key: "engorde", label: "Engorde", Component: EngordeMockup },
  { key: "ventas", label: "Ventas", Component: VentasMockup },
] as const

export function Hero() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_SCREENS.length), 4600)
    return () => clearInterval(id)
  }, [])

  const Active = HERO_SCREENS[index].Component

  return (
    <section className="relative bg-brand-dark overflow-hidden -mt-20 pt-20 md:-mt-24 md:pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 relative z-10 pt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">La app #1 para avicultores</span>
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                Maneja tu granja con
                <span className="block bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  precisión e inteligencia.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-lg leading-relaxed">
                La plataforma SaaS más completa para el control de{" "}
                <span className="text-white font-semibold">ponedoras</span>,{" "}
                <span className="text-white font-semibold">engorde</span> y{" "}
                <span className="text-white font-semibold">levante</span>. Toma decisiones basadas
                en datos reales.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                size="lg"
                onClick={() => navigate("/auth/signup")}
                className="h-14 px-8 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-brand-dark rounded-xl text-base font-bold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5 group"
              >
                Empieza gratis por 14 días
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button className="flex items-center gap-3 h-14 px-6 rounded-xl font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all group">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                </div>
                Ver demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-brand-dark"
                  />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-white">+10,000</span>
                <span className="text-white/60"> productores confían en nosotros</span>
                <div className="flex items-center gap-1 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white/60 ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Quick Features */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, text: "Datos seguros" },
                { icon: Zap, text: "Tiempo real" },
                { icon: Check, text: "Sin tarjeta" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-white/80"
                >
                  <item.icon className="w-4 h-4 text-cyan-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated phone mockup */}
          <div className="relative w-full flex justify-center lg:justify-end items-center pt-6 lg:pt-0">
            {/* Glow behind the phone */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[380px] h-[380px] rounded-full bg-cyan-400/20 blur-[120px]" />
            </div>

            {/* Floating dots for ambience */}
            <FloatingBadge
              className="absolute top-4 -left-6 lg:left-0 z-20"
              color="from-emerald-400 to-teal-500"
              emoji="🥚"
              title="+420 huevos"
              subtitle="hoy"
            />
            <FloatingBadge
              className="absolute bottom-16 -right-2 lg:right-8 z-20 delay-200"
              color="from-amber-400 to-orange-500"
              emoji="📈"
              title="+12.4%"
              subtitle="ingresos"
            />
            <FloatingBadge
              className="absolute top-1/2 -right-4 lg:-right-4 z-20 delay-500"
              color="from-cyan-400 to-blue-500"
              emoji="⚡"
              title="Sync live"
              subtitle="3 granjas"
            />

            <div className="relative z-10">
              <PhoneFrame label={HERO_SCREENS[index].label} tilt="left" floating>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={HERO_SCREENS[index].key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <Active />
                  </motion.div>
                </AnimatePresence>
              </PhoneFrame>
            </div>

            {/* Mini navigation dots */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {HERO_SCREENS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-cyan-400" : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Ver ${s.label}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FloatingBadge({
  className,
  color,
  emoji,
  title,
  subtitle,
}: {
  className?: string
  color: string
  emoji: string
  title: string
  subtitle: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 },
        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`hidden lg:flex ${className} items-center gap-2 px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50`}
    >
      <div
        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-base shadow-md`}
      >
        {emoji}
      </div>
      <div>
        <p className="text-xs font-black text-slate-800 leading-tight">{title}</p>
        <p className="text-[10px] text-slate-500 leading-tight">{subtitle}</p>
      </div>
    </motion.div>
  )
}
