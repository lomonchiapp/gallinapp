import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, TrendingUp } from "lucide-react"
import { mockupTheme } from "./mockup-utils"

/**
 * Mockup del modulo de Engorde: curva de peso, conversion alimenticia y mortalidad acumulada.
 */
export function EngordeMockup() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400)
    return () => clearInterval(id)
  }, [])

  const points = Array.from({ length: 8 }).map((_, i) => {
    // curva de crecimiento simulada
    const base = 0.045 + i * 0.32 + Math.sin(tick / 4 + i) * 0.04
    return Math.min(2.6, base)
  })
  const max = Math.max(...points)
  const w = 220
  const h = 70

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - (p / max) * h
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const pesoActual = points[points.length - 1].toFixed(2)

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      {/* Header */}
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, #047857 0%, #065F46 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Engorde</p>
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="mt-2">
          <p className="text-[9px] opacity-80">Lote ENG-07 · Cobb 500</p>
          <p className="text-lg font-black mt-0.5">Dia 35 · 4,250 aves</p>
        </div>
      </div>

      <div className="px-3 pt-3 space-y-2.5">
        {/* Weight chart card */}
        <div className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <p className="text-[10px] text-slate-500 font-semibold">Peso promedio</p>
              <motion.p
                key={pesoActual}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-black text-slate-800"
              >
                {pesoActual} <span className="text-[10px] text-slate-400">kg</span>
              </motion.p>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
              +110g/dia
            </span>
          </div>

          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20 overflow-visible">
            <defs>
              <linearGradient id="engordeGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${path} L ${w} ${h} L 0 ${h} Z`}
              fill="url(#engordeGrad)"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.path
              key={path}
              d={path}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4 }}
            />
            {points.map((p, i) => {
              const x = (i / (points.length - 1)) * w
              const y = h - (p / max) * h
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="white"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.4 }}
                />
              )
            })}
          </svg>
          <div className="flex justify-between text-[8px] text-slate-400 font-medium mt-1">
            <span>D1</span>
            <span>D5</span>
            <span>D10</span>
            <span>D15</span>
            <span>D20</span>
            <span>D25</span>
            <span>D30</span>
            <span>D35</span>
          </div>
        </div>

        {/* Mortality + FCR row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm">
            <p className="text-[8px] text-slate-400 font-bold uppercase">Mortalidad acumulada</p>
            <p className="text-base font-black" style={{ color: "#DC2626" }}>
              2.1%
            </p>
            <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-rose-500"
                animate={{ width: "21%" }}
              />
            </div>
            <p className="text-[8px] text-slate-400 mt-0.5">Meta: ≤ 4%</p>
          </div>

          <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm">
            <p className="text-[8px] text-slate-400 font-bold uppercase">FCR</p>
            <p className="text-base font-black text-slate-800">1.62</p>
            <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: mockupTheme.primary }}
                animate={{ width: "78%" }}
              />
            </div>
            <p className="text-[8px] text-emerald-600 font-bold mt-0.5">Excelente</p>
          </div>
        </div>

        {/* Listo para venta */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-xl p-2.5 text-white shadow-md flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)` }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
            🐔
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black">Listo para venta en 7 dias</p>
            <p className="text-[8px] opacity-90">Peso objetivo: 2.8 kg</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
