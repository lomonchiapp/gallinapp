import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ShoppingCart, CheckCircle2 } from "lucide-react"
import { mockupTheme, formatDOP } from "./mockup-utils"

/**
 * Mockup del modulo de Ventas: flujo de generacion de una venta con debito automatico.
 */
export function VentasMockup() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 2600)
    return () => clearInterval(id)
  }, [])

  const items = [
    { nombre: "Cartones de 30 (A)", cant: 40, unit: 180, codigo: "HV-A30" },
    { nombre: "Cartones de 30 (B)", cant: 12, unit: 150, codigo: "HV-B30" },
    { nombre: "Pollo entero 2.5kg", cant: 8, unit: 420, codigo: "PO-2500" },
  ]
  const subtotal = items.reduce((a, b) => a + b.cant * b.unit, 0)
  const itbis = subtotal * 0.18
  const total = subtotal + itbis

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, #D97706 0%, #92400E 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Nueva venta</p>
          <ShoppingCart className="w-4 h-4" />
        </div>

        <div className="mt-2 flex gap-1.5">
          {["Cliente", "Productos", "Pago"].map((s, i) => (
            <motion.div
              key={s}
              animate={{
                backgroundColor: i <= step ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
              }}
              className="flex-1 rounded-full py-1 text-center"
            >
              <span className="text-[9px] font-black">{s}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-3 pt-3 flex-1">
        {/* Cliente */}
        <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs"
              style={{ background: mockupTheme.primary }}
            >
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-800 truncate">Supermercado El Progreso</p>
              <p className="text-[8px] text-slate-400">RNC 131-00245-8 · Credito 30d</p>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm mb-2">
          <p className="text-[9px] font-bold text-slate-500 uppercase mb-1.5">Productos</p>
          <div className="space-y-1.5">
            {items.map((it, i) => (
              <motion.div
                key={it.codigo}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between text-[9px]"
              >
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-500 font-black text-[8px]">
                    x{it.cant}
                  </span>
                  <span className="font-bold text-slate-700 truncate">{it.nombre}</span>
                </div>
                <span className="font-black text-slate-800">{formatDOP(it.cant * it.unit)}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 space-y-0.5">
            <Row label="Subtotal" value={formatDOP(subtotal)} />
            <Row label="ITBIS 18%" value={formatDOP(itbis)} />
            <Row label="Total" value={formatDOP(total)} bold />
          </div>
        </div>

        {/* Inventario auto-debito */}
        <AnimatePresence mode="wait">
          {step >= 2 && (
            <motion.div
              key="debit"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-2.5 text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${mockupTheme.primary} 0%, #1E3A8A 100%)` }}
            >
              <p className="text-[9px] font-black flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Inventario debitado automaticamente
              </p>
              <p className="text-[8px] opacity-80 mt-0.5">
                52 cartones + 8 aves descontadas del stock.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className={`text-[9px] ${bold ? "font-black text-slate-800" : "text-slate-500 font-semibold"}`}>
        {label}
      </span>
      <span className={`${bold ? "text-sm font-black" : "text-[9px] font-bold"} text-slate-800`}>
        {value}
      </span>
    </div>
  )
}
