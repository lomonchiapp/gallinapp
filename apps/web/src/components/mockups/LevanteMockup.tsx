import { motion } from "framer-motion"
import { ChevronLeft, Syringe, Calendar } from "lucide-react"
import { mockupTheme } from "./mockup-utils"

/**
 * Mockup del modulo de Levante: cronograma de vacunacion + uniformidad de lote.
 */
export function LevanteMockup() {
  const vacunas = [
    { sem: 1, nombre: "Marek + HVT", estado: "ok" },
    { sem: 4, nombre: "Newcastle + Bronquitis", estado: "ok" },
    { sem: 8, nombre: "Gumboro", estado: "ok" },
    { sem: 12, nombre: "Coriza", estado: "today" },
    { sem: 16, nombre: "Triple aviar", estado: "next" },
    { sem: 18, nombre: "Encefalomielitis", estado: "next" },
  ]

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Levante</p>
          <Calendar className="w-4 h-4" />
        </div>
        <p className="text-[9px] opacity-80 mt-2">Lote LEV-03 · Hy-Line W-36</p>
        <p className="text-lg font-black mt-0.5">Sem 12 · 5,400 pollas</p>
      </div>

      <div className="px-3 pt-3 space-y-2.5">
        {/* Uniformidad gauge */}
        <div className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-slate-700">Uniformidad de peso</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
              Optima
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={mockupTheme.primary}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 14}
                  initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - 0.87) }}
                  transition={{ duration: 1.4 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black" style={{ color: mockupTheme.primary }}>
                  87%
                </span>
                <span className="text-[7px] text-slate-400 font-bold">CV 7.2</span>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <Bar label="Peso prom." value="1.04 kg" pct={88} color="#7C3AED" />
              <Bar label="Standard" value="1.10 kg" pct={92} color="#94A3B8" />
              <Bar label="Consumo" value="58 g/ave" pct={71} color="#F59E0B" />
            </div>
          </div>
        </div>

        {/* Vaccination schedule */}
        <div className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <Syringe className="w-3 h-3" style={{ color: mockupTheme.primary }} />
            <p className="text-[10px] font-bold text-slate-700">Cronograma sanitario</p>
          </div>
          <div className="space-y-1.5">
            {vacunas.map((v, i) => (
              <motion.div
                key={v.sem}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black ${
                    v.estado === "ok"
                      ? "bg-emerald-100 text-emerald-700"
                      : v.estado === "today"
                      ? "bg-amber-500 text-white animate-pulse"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {v.estado === "ok" ? "✓" : v.sem}
                </div>
                <span className="text-[9px] font-semibold text-slate-700 flex-1">
                  Sem {v.sem} · {v.nombre}
                </span>
                {v.estado === "today" && (
                  <span className="text-[8px] font-black text-amber-600">HOY</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Bar({
  label,
  value,
  pct,
  color,
}: {
  label: string
  value: string
  pct: number
  color: string
}) {
  return (
    <div>
      <div className="flex justify-between text-[8px] font-bold">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-700">{value}</span>
      </div>
      <div className="h-1 rounded-full bg-slate-100 overflow-hidden mt-0.5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2 }}
        />
      </div>
    </div>
  )
}
