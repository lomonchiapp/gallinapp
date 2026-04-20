import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Home, Box, Receipt, Tag } from "lucide-react"
import { formatDOP, formatNumber, mockupTheme } from "./mockup-utils"

/**
 * Mockup animado del Dashboard de la app mobile.
 * Metricas que se actualizan en vivo, mini-charts y widgets estilo Gallinapp.
 */
export function DashboardMockup() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200)
    return () => clearInterval(id)
  }, [])

  // valores "vivos" que se recalculan
  const huevos = 12480 + Math.floor(Math.sin(tick) * 40) + tick * 12
  const ingresos = 287600 + Math.floor(Math.cos(tick) * 1200) + tick * 180
  const mortalidad = Math.max(0.8, 1.4 + Math.sin(tick / 3) * 0.3).toFixed(2)
  const conversion = (1.78 + Math.sin(tick / 4) * 0.05).toFixed(2)

  const bars = Array.from({ length: 7 }).map((_, i) => {
    const base = 60 + Math.sin(tick / 2 + i) * 20 + Math.cos(i) * 10
    return Math.max(25, Math.min(95, base))
  })

  const days = ["L", "M", "M", "J", "V", "S", "D"]

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-50 to-white flex flex-col text-slate-800 select-none">
      {/* Header */}
      <div
        className="px-4 pt-3 pb-5 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${mockupTheme.primary} 0%, #1E3A8A 100%)` }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] opacity-80">Buen dia, Elvio</p>
            <p className="text-sm font-bold">Granja La Esperanza</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
            className="relative p-1.5 rounded-full bg-white/15"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-400 border border-white" />
          </motion.div>
        </div>

        {/* Hero metric */}
        <div className="relative z-10 mt-3">
          <p className="text-[10px] opacity-70 uppercase tracking-wider">Ingresos del mes</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={Math.floor(ingresos / 100)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black"
            >
              {formatDOP(ingresos)}
            </motion.span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 font-bold">
              +12.4%
            </span>
          </div>
        </div>
      </div>

      {/* Widgets grid */}
      <div className="px-3 -mt-3 space-y-2.5 relative z-10">
        <div className="grid grid-cols-2 gap-2">
          <MetricCard
            label="Huevos hoy"
            value={formatNumber(huevos)}
            sub="+420 vs ayer"
            color="#F59E0B"
            icon="egg"
          />
          <MetricCard
            label="Mortalidad"
            value={`${mortalidad}%`}
            sub="Optima"
            color="#10B981"
            icon="heart"
          />
        </div>

        {/* Chart widget */}
        <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-slate-700">Produccion semanal</p>
            <span className="text-[9px] text-slate-400">Docenas</span>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-md"
                style={{
                  background: `linear-gradient(180deg, ${mockupTheme.primary} 0%, #5B7DC4 100%)`,
                }}
                animate={{ height: `${h}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[8px] text-slate-400 font-medium">
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
          <p className="text-[11px] font-bold text-slate-700 mb-1.5">Conversion alimenticia</p>
          <div className="flex items-center gap-2">
            <motion.div
              key={conversion}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-black"
              style={{ color: mockupTheme.primary }}
            >
              {conversion}
            </motion.div>
            <span className="text-[9px] text-slate-400">kg alim / kg peso</span>
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: mockupTheme.primary }}
              animate={{ width: `${Math.min(100, Number(conversion) * 45)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="mt-auto bg-white border-t border-slate-100 flex items-center justify-around py-2 px-3">
        {[
          { icon: Home, label: "Inicio", active: true },
          { icon: Box, label: "Inv" },
          { icon: Receipt, label: "Gastos" },
          { icon: Tag, label: "Ventas" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <item.icon
              className="w-4 h-4"
              style={{ color: item.active ? mockupTheme.primary : "#94A3B8" }}
            />
            <span
              className="text-[8px] font-bold"
              style={{ color: item.active ? mockupTheme.primary : "#94A3B8" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string
  value: string
  sub: string
  color: string
  icon: "egg" | "heart"
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-100 p-2.5 shadow-sm relative overflow-hidden">
      <div
        className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-10"
        style={{ background: color }}
      />
      <div className="flex items-center justify-between relative z-10">
        <p className="text-[9px] text-slate-500 font-semibold">{label}</p>
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          {icon === "egg" ? <EggIcon color={color} /> : <HeartIcon color={color} />}
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.p
          key={value}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-base font-black text-slate-800 mt-0.5"
        >
          {value}
        </motion.p>
      </AnimatePresence>
      <p className="text-[8px] text-slate-400 font-medium">{sub}</p>
    </div>
  )
}

function EggIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill={color}>
      <path d="M12 2C8 2 5 9 5 14a7 7 0 0014 0c0-5-3-12-7-12z" />
    </svg>
  )
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill={color}>
      <path d="M12 21s-7-4.5-9.5-9a5.5 5.5 0 019.5-4 5.5 5.5 0 019.5 4C19 16.5 12 21 12 21z" />
    </svg>
  )
}
