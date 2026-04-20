import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Bell, AlertTriangle, Activity, CheckCircle2 } from "lucide-react"
import { mockupTheme } from "./mockup-utils"

/**
 * Mockup del centro de alertas / notificaciones de la app.
 */
export function AlertasMockup() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 2400)
    return () => clearInterval(id)
  }, [])

  const baseAlerts = [
    {
      icon: AlertTriangle,
      tipo: "Mortalidad alta",
      desc: "Lote ENG-07 +12 aves hoy",
      tiempo: "hace 2m",
      color: "#DC2626",
      fondo: "#FEE2E2",
    },
    {
      icon: Activity,
      tipo: "Postura debajo del estandar",
      desc: "PON-12 cayo a 85%",
      tiempo: "hace 1h",
      color: "#F59E0B",
      fondo: "#FEF3C7",
    },
    {
      icon: Bell,
      tipo: "Vacuna programada",
      desc: "LEV-03 · Coriza · hoy 10am",
      tiempo: "hace 3h",
      color: "#345DAD",
      fondo: "#DBEAFE",
    },
    {
      icon: CheckCircle2,
      tipo: "Lote listo para venta",
      desc: "ENG-07 alcanzo 2.8 kg",
      tiempo: "ayer",
      color: "#10B981",
      fondo: "#D1FAE5",
    },
  ]

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, ${mockupTheme.primary} 0%, #1E3A8A 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Alertas</p>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          >
            <Bell className="w-4 h-4" />
          </motion.div>
        </div>
        <p className="text-[9px] opacity-80 mt-2">{baseAlerts.length} alertas activas</p>
        <p className="text-base font-black">Mantente al tanto</p>
      </div>

      <div className="px-3 pt-3 space-y-1.5">
        <AnimatePresence>
          {baseAlerts.map((a, i) => {
            const Icon = a.icon
            const isNew = i === count % baseAlerts.length
            return (
              <motion.div
                key={a.tipo}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: isNew ? [1, 1.02, 1] : 1,
                  boxShadow: isNew
                    ? "0 4px 12px rgba(52, 93, 173, 0.15)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl bg-white p-2.5 border border-slate-100 flex gap-2 items-start"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: a.fondo }}
                >
                  <Icon className="w-4 h-4" style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-800 truncate">{a.tipo}</p>
                    {isNew && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: a.color }}
                      />
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500 truncate">{a.desc}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{a.tiempo}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
