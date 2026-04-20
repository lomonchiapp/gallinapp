import { motion } from "framer-motion"
import { ChevronLeft, Package, AlertTriangle } from "lucide-react"

/**
 * Mockup del modulo de Inventario PRO con niveles de stock animados
 * y alertas de stock bajo, replicando el estilo de la app mobile.
 */
export function InventarioMockup() {
  const items = [
    { nombre: "Alimento ponedora", stock: 84, max: 100, unit: "sacos", color: "#10B981", almacen: "Galpon 1" },
    { nombre: "Vacuna Newcastle", stock: 12, max: 50, unit: "dosis", color: "#F59E0B", almacen: "Sanidad" },
    { nombre: "Cartones de 30", stock: 320, max: 500, unit: "und", color: "#10B981", almacen: "Empaque" },
    { nombre: "Viruta", stock: 5, max: 40, unit: "fardos", color: "#DC2626", almacen: "Galpon 2" },
    { nombre: "Maiz a granel", stock: 1850, max: 3000, unit: "kg", color: "#10B981", almacen: "Silo" },
  ]

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Inventario</p>
          <Package className="w-4 h-4" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {[
            { label: "Articulos", val: "47" },
            { label: "Almacenes", val: "5" },
            { label: "Alertas", val: "2", warn: true },
          ].map((s) => (
            <div key={s.label} className="rounded-md bg-white/15 p-1.5 text-center">
              <p className="text-[8px] opacity-80">{s.label}</p>
              <p className={`text-sm font-black ${s.warn ? "text-amber-300" : "text-white"}`}>
                {s.val}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 pt-3 space-y-1.5">
        {items.map((it, i) => {
          const pct = (it.stock / it.max) * 100
          const low = pct < 20
          return (
            <motion.div
              key={it.nombre}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {low && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                    </motion.div>
                  )}
                  <p className="text-[10px] font-bold text-slate-800 truncate">{it.nombre}</p>
                </div>
                <p className="text-[10px] font-black tabular-nums" style={{ color: low ? "#DC2626" : "#1F2937" }}>
                  {it.stock} <span className="text-[8px] text-slate-400 font-bold">{it.unit}</span>
                </p>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: it.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, delay: i * 0.08 }}
                />
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-[8px] text-slate-400 font-semibold">{it.almacen}</p>
                {low && (
                  <span className="text-[8px] font-black text-rose-600 uppercase">Stock bajo</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
