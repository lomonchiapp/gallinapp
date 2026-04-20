import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import {
  PhoneFrame,
  DashboardMockup,
  PonedorasMockup,
  EngordeMockup,
  LevanteMockup,
  GastosMockup,
  VentasMockup,
  FacturacionMockup,
  InventarioMockup,
  AlertasMockup,
  MultiGranjaMockup,
  ColaboradoresMockup,
} from "@/components/mockups"
import {
  LayoutDashboard,
  Egg,
  Beef,
  Sprout,
  Receipt,
  ShoppingCart,
  FileText,
  Boxes,
  BellRing,
  MapPin,
  Users,
  Sparkles,
  Check,
} from "lucide-react"

type Module = {
  id: string
  icon: typeof LayoutDashboard
  label: string
  title: string
  tagline: string
  bullets: string[]
  plan: "Incluido" | "Básico" | "Pro" | "Hacienda"
  Component: React.ComponentType
  accent: string
}

const MODULES: Module[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Inicio",
    title: "Un centro de mando en tu bolsillo.",
    tagline: "Widgets personalizables con ingresos del mes, producción, conversión alimenticia y alertas en vivo.",
    bullets: [
      "Ingresos y costos recalculados en tiempo real",
      "Widgets arrastrables (drag & drop) y modo oscuro",
      "Resumen de las granjas que administras",
    ],
    plan: "Incluido",
    Component: DashboardMockup,
    accent: "from-sky-500 to-blue-600",
  },
  {
    id: "ponedoras",
    icon: Egg,
    label: "Ponedoras",
    title: "Controla cada huevo, no solo el total.",
    tagline: "Clasificación diaria A / B / doble yema / sucio / roto, % postura, costo unitario y proyección por lote.",
    bullets: [
      "Registro diario con 5 clases de huevo",
      "Curva de postura y comparativo vs. estándar",
      "Cálculo automático del costo por huevo",
    ],
    plan: "Básico",
    Component: PonedorasMockup,
    accent: "from-amber-500 to-yellow-600",
  },
  {
    id: "engorde",
    icon: Beef,
    label: "Engorde",
    title: "Peso, FCR y mortalidad al día 35.",
    tagline: "Curva de crecimiento, conversión alimenticia y aviso automático cuando el lote está listo para vender.",
    bullets: [
      "Pesajes y mortalidad con causa",
      "Conversión alimenticia (FCR) en tiempo real",
      "Alerta al alcanzar peso objetivo",
    ],
    plan: "Básico",
    Component: EngordeMockup,
    accent: "from-emerald-500 to-green-600",
  },
  {
    id: "levante",
    icon: Sprout,
    label: "Levante",
    title: "Cronograma sanitario sin descuidos.",
    tagline: "Calendario de vacunación por semana, uniformidad de peso y comparativo contra estándar de raza.",
    bullets: [
      "Cronograma completo por raza",
      "Uniformidad con coeficiente de variación",
      "Dashboard comparativo entre lotes",
    ],
    plan: "Básico",
    Component: LevanteMockup,
    accent: "from-violet-500 to-purple-600",
  },
  {
    id: "gastos",
    icon: Receipt,
    label: "Gastos",
    title: "Sabe exactamente dónde se va el dinero.",
    tagline: "Registra insumos, alimento, sanidad, energía y mano de obra. Cada gasto se asigna a un lote.",
    bullets: [
      "Catálogo de artículos reutilizables",
      "Distribución por categoría (dona animada)",
      "Historial filtrado por lote y fecha",
    ],
    plan: "Básico",
    Component: GastosMockup,
    accent: "from-teal-500 to-emerald-600",
  },
  {
    id: "ventas",
    icon: ShoppingCart,
    label: "Ventas",
    title: "Vende por unidad, cartón o lote entero.",
    tagline: "Flujo de venta en 3 pasos con débito automático de inventario y cálculo de ITBIS.",
    bullets: [
      "Clientes con RNC y crédito 30/60 días",
      "Débito automático de stock",
      "Generación de NCF en un clic",
    ],
    plan: "Pro",
    Component: VentasMockup,
    accent: "from-orange-500 to-amber-600",
  },
  {
    id: "facturacion",
    icon: FileText,
    label: "Facturación",
    title: "NCF válidos ante la DGII, en segundos.",
    tagline: "Emisión de comprobantes fiscales con numeración consecutiva, ITBIS y envío por email al cliente.",
    bullets: [
      "Secuencia NCF controlada automáticamente",
      "PDF profesional con logo y datos fiscales",
      "Envío y duplicados en un toque",
    ],
    plan: "Pro",
    Component: FacturacionMockup,
    accent: "from-rose-500 to-pink-600",
  },
  {
    id: "inventario",
    icon: Boxes,
    label: "Inventario",
    title: "Stock por almacén, con alertas inteligentes.",
    tagline: "Múltiples almacenes, movimientos de entrada/salida y alertas cuando un artículo baja del mínimo.",
    bullets: [
      "Almacenes ilimitados (por galpón)",
      "Alertas visuales de stock bajo",
      "Movimientos auditables",
    ],
    plan: "Pro",
    Component: InventarioMockup,
    accent: "from-indigo-500 to-violet-600",
  },
  {
    id: "alertas",
    icon: BellRing,
    label: "Alertas",
    title: "Ningún problema pasa desapercibido.",
    tagline: "Notificaciones push cuando la mortalidad sube, cae la postura o un lote está listo para venta.",
    bullets: [
      "Push en tiempo real a todo el equipo",
      "Umbrales configurables por granja",
      "Historial auditable de eventos",
    ],
    plan: "Básico",
    Component: AlertasMockup,
    accent: "from-red-500 to-rose-600",
  },
  {
    id: "multi-granja",
    icon: MapPin,
    label: "Multi-Granja",
    title: "Todas tus granjas, una sola cuenta.",
    tagline: "Cambia de granja sin cerrar sesión. Cada una con sus propios lotes, colaboradores y reportes.",
    bullets: [
      "Hasta 10 granjas con plan Hacienda",
      "Datos aislados por tenant",
      "KPIs consolidados por regional",
    ],
    plan: "Pro",
    Component: MultiGranjaMockup,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    id: "colaboradores",
    icon: Users,
    label: "Equipo",
    title: "Invita a tu equipo y controla lo que ven.",
    tagline: "Roles granulares: Owner, Admin y Operario. El dueño paga, los operarios entran gratis.",
    bullets: [
      "Invitación por email o link",
      "Roles con permisos por módulo",
      "Auditoría de cambios por usuario",
    ],
    plan: "Básico",
    Component: ColaboradoresMockup,
    accent: "from-fuchsia-500 to-purple-600",
  },
]

const planColors: Record<Module["plan"], string> = {
  Incluido: "bg-slate-100 text-slate-700",
  "Básico": "bg-sky-100 text-sky-700",
  Pro: "bg-amber-100 text-amber-700",
  Hacienda: "bg-emerald-100 text-emerald-700",
}

export function Modules() {
  const [active, setActive] = useState(0)
  const current = MODULES[active]
  const Active = current.Component

  return (
    <Section id="modulos" background="white" padding="lg" className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-100 mb-6">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-semibold text-sky-700">Los módulos, en acción</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 leading-tight">
            Cada módulo,{" "}
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              visto por dentro.
            </span>
          </h2>
          <p className="text-lg text-stripe-text">
            Sin screenshots estáticos. Lo que ves es el flujo real de la app, animado con datos
            de demostración.
          </p>
        </div>

        {/* Tabs pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {MODULES.map((m, i) => {
            const Icon = m.icon
            const isActive = i === active
            return (
              <button
                key={m.id}
                onClick={() => setActive(i)}
                className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "bg-brand-dark text-white shadow-lg scale-105"
                    : "bg-white text-stripe-muted border border-stripe-border hover:border-sky-300 hover:text-brand-dark"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-stripe-muted group-hover:text-sky-500"}`}
                />
                {m.label}
              </button>
            )
          })}
        </div>

        {/* Main split: copy + phone */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.accent} flex items-center justify-center shadow-lg`}
                >
                  <current.icon className="w-7 h-7 text-white" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    planColors[current.plan]
                  }`}
                >
                  {current.plan}
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-brand-dark leading-tight">
                {current.title}
              </h3>

              <p className="text-lg text-stripe-text leading-relaxed">{current.tagline}</p>

              <ul className="space-y-3">
                {current.bullets.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-cyan-600" />
                    </div>
                    <span className="text-stripe-text">{b}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="relative flex justify-center">
            {/* Colored glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-[340px] h-[340px] rounded-full blur-[100px] opacity-40 bg-gradient-to-br ${current.accent}`}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -10, rotate: 4 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <PhoneFrame label={current.label} tilt="right" floating>
                  <Active />
                </PhoneFrame>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  )
}
