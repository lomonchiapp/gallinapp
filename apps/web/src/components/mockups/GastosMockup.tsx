import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Filter, Wheat, Pill, Zap, Users } from "lucide-react"
import { formatDOP } from "./mockup-utils"

/**
 * Mockup de la pantalla de Gastos con historial animado y dashboard de categorias.
 */
export function GastosMockup() {
  const [sel, setSel] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSel((s) => (s + 1) % 4), 2200)
    return () => clearInterval(id)
  }, [])

  const cats = [
    { label: "Alimento", icon: Wheat, color: "#D97706", pct: 62, total: 184200 },
    { label: "Sanidad", icon: Pill, color: "#DC2626", pct: 14, total: 41400 },
    { label: "Energia", icon: Zap, color: "#FBBF24", pct: 12, total: 35800 },
    { label: "Personal", icon: Users, color: "#10B981", pct: 12, total: 34600 },
  ]

  const historial = [
    { desc: "Alimento ponedora 50kg", cat: "Alimento", monto: 12500, lote: "PON-12" },
    { desc: "Vacuna Newcastle", cat: "Sanidad", monto: 3200, lote: "LEV-03" },
    { desc: "Factura CEPM", cat: "Energia", monto: 8900, lote: "General" },
    { desc: "Pago jornada", cat: "Personal", monto: 5400, lote: "General" },
  ]

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, #059669 0%, #065F46 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Gastos</p>
          <Filter className="w-4 h-4" />
        </div>
        <div className="mt-2">
          <p className="text-[9px] opacity-80">Total del mes</p>
          <p className="text-xl font-black">{formatDOP(296000)}</p>
          <div className="flex gap-1 mt-2 text-[9px] font-bold">
            <span className="px-2 py-0.5 rounded-full bg-white/25">Dashboard</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70">Historial</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70">Articulos</span>
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 space-y-2.5">
        {/* Donut */}
        <div className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-700 mb-1.5">Por categoria</p>
          <div className="flex items-center gap-3">
            <Donut data={cats} active={sel} />
            <div className="flex-1 space-y-1">
              {cats.map((c, i) => (
                <motion.div
                  key={c.label}
                  animate={{
                    backgroundColor: i === sel ? "#F1F5F9" : "transparent",
                  }}
                  className="flex items-center gap-1.5 rounded-md px-1 py-0.5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="text-[9px] font-bold text-slate-700 flex-1">{c.label}</span>
                  <span className="text-[9px] font-black text-slate-500">{c.pct}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-700 mb-1.5">Ultimos registros</p>
          <div className="space-y-1.5">
            {historial.map((h, i) => {
              const cat = cats.find((c) => c.label === h.cat)!
              const Icon = cat.icon
              return (
                <motion.div
                  key={h.desc}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `${cat.color}15` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-slate-800 truncate">{h.desc}</p>
                    <p className="text-[8px] text-slate-400">{h.lote}</p>
                  </div>
                  <p className="text-[10px] font-black text-slate-700">-{formatDOP(h.monto)}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Donut({
  data,
  active,
}: {
  data: { color: string; pct: number }[]
  active: number
}) {
  const total = data.reduce((a, b) => a + b.pct, 0)
  const r = 14
  const c = 2 * Math.PI * r

  // Precalcular offsets acumulados sin mutar variable externa al map
  const segments = data.map((d, i) => {
    const prevSum = data.slice(0, i).reduce((acc, v) => acc + v.pct, 0)
    return {
      ...d,
      dash: (d.pct / total) * c,
      offset: (prevSum / total) * c,
    }
  })

  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#F1F5F9" strokeWidth="5" />
        {segments.map((d, i) => (
          <motion.circle
            key={i}
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={i === active ? 6 : 5}
            strokeDasharray={`${d.dash} ${c - d.dash}`}
            strokeDashoffset={-d.offset}
            animate={{ strokeWidth: i === active ? 6 : 5 }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={active}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-black"
          style={{ color: data[active].color }}
        >
          {data[active].pct}%
        </motion.span>
      </div>
    </div>
  )
}
