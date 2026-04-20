import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Plus } from "lucide-react"
import { mockupTheme, formatNumber } from "./mockup-utils"

/**
 * Mockup de la pantalla de Ponedoras: registro diario de huevos por clasificacion.
 * Las clasificaciones se animan como contadores en vivo.
 */
export function PonedorasMockup() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800)
    return () => clearInterval(id)
  }, [])

  const clases = [
    { label: "Huevo A", color: "#345DAD", base: 8420 },
    { label: "Huevo B", color: "#5B7DC4", base: 1240 },
    { label: "Doble yema", color: "#FBBF24", base: 132 },
    { label: "Sucio", color: "#A16207", base: 86 },
    { label: "Roto", color: "#DC2626", base: 22 },
  ]

  const total = clases.reduce((acc, c) => acc + c.base + tick * (c.base > 1000 ? 8 : 1), 0)

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      {/* Header */}
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, ${mockupTheme.primary} 0%, #1E3A8A 100%)` }}
      >
        <div className="flex items-center justify-between mb-2">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Ponedoras</p>
          <Plus className="w-4 h-4" />
        </div>
        <div className="flex gap-1.5 text-[9px] font-bold">
          <span className="px-2 py-0.5 rounded-full bg-white/25">Lotes</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70">Estadisticas</span>
        </div>
      </div>

      {/* Lote card */}
      <div className="px-3 pt-3 space-y-2.5">
        <div className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[11px] font-black text-slate-800">Lote PON-12</p>
              <p className="text-[9px] text-slate-400">Hy-Line W-36 · Sem 38</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">
              Activo
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            <Stat label="Aves" value="9,820" />
            <Stat label="% Postura" value="92.4%" highlight />
            <Stat label="Costo/und" value="$1.42" />
          </div>

          {/* Live counter */}
          <div className="rounded-lg bg-slate-50 p-2 mt-1">
            <p className="text-[8px] text-slate-500 font-bold uppercase">Total recolectado hoy</p>
            <motion.p
              key={total}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-black"
              style={{ color: mockupTheme.primary }}
            >
              {formatNumber(total)} <span className="text-[10px] text-slate-500">und</span>
            </motion.p>
          </div>
        </div>

        {/* Classification breakdown */}
        <div className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-700 mb-2">Clasificacion en vivo</p>
          <div className="space-y-1.5">
            {clases.map((c, i) => {
              const value = c.base + tick * (c.base > 1000 ? 8 : 1)
              const pct = (value / total) * 100
              return (
                <div key={c.label} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="text-[9px] font-semibold text-slate-600 w-16">{c.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: c.color }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.04 }}
                    />
                  </div>
                  <span className="text-[9px] font-black text-slate-700 w-10 text-right tabular-nums">
                    {formatNumber(value)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating action button */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: mockupTheme.primary }}
      >
        <Plus className="w-5 h-5 text-white" />
      </motion.div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">{label}</p>
      <p
        className="text-[12px] font-black"
        style={{ color: highlight ? mockupTheme.primary : "#1F2937" }}
      >
        {value}
      </p>
    </div>
  )
}
