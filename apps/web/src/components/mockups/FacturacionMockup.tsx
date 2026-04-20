import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, FileText, Download } from "lucide-react"
import { mockupTheme, formatDOP } from "./mockup-utils"

/**
 * Mockup de Facturacion con NCF (Dominican Fiscal Receipt).
 * Muestra el flujo de generacion + NCF animado.
 */
export function FacturacionMockup() {
  const [ncfIndex, setNcfIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setNcfIndex((i) => i + 1), 2000)
    return () => clearInterval(id)
  }, [])

  const ncfBase = 11020000024
  const currentNCF = `B01${String(ncfBase + ncfIndex).padStart(11, "0")}`

  // barcode pattern precomputed (determinista, sin Math.random durante render)
  const barcode = useMemo(
    () =>
      Array.from({ length: 44 }).map((_, i) => ({
        width: i % 3 === 0 ? 2 : 1,
        height: i % 5 === 0 ? "100%" : "80%",
        opacity: (i * 37) % 13 > 1 ? 1 : 0,
      })),
    []
  )

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, #BE123C 0%, #881337 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Facturacion</p>
          <Download className="w-4 h-4" />
        </div>
        <div className="mt-2">
          <p className="text-[9px] opacity-80">Factura con valor fiscal</p>
          <p className="text-lg font-black">Generar NCF</p>
        </div>
      </div>

      {/* NCF receipt simulation */}
      <div className="px-3 pt-3">
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="relative rounded-xl bg-white border border-slate-100 shadow-lg overflow-hidden"
        >
          {/* Perforation */}
          <div className="absolute left-0 right-0 top-0 h-2 flex overflow-hidden">
            <div className="w-full h-2 bg-slate-100" style={{
              backgroundImage: "radial-gradient(circle at 6px 0, transparent 3px, white 3px)",
              backgroundSize: "12px 12px"
            }} />
          </div>

          <div className="p-3 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[8px] text-slate-400 font-bold uppercase">Granja La Esperanza SRL</p>
                <p className="text-[7px] text-slate-400">RNC 130-12345-6</p>
              </div>
              <div className="text-right">
                <p className="text-[7px] text-slate-400 font-bold">FACTURA FISCAL</p>
                <p className="text-[7px] text-slate-400">20/04/2026</p>
              </div>
            </div>

            <div className="rounded-md border border-dashed border-slate-300 p-2 mb-2 bg-slate-50">
              <p className="text-[7px] text-slate-500 font-bold">NCF</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentNCF}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-sm font-black tracking-wider"
                  style={{ color: mockupTheme.primary, fontFamily: "monospace" }}
                >
                  {currentNCF}
                </motion.p>
              </AnimatePresence>
              <p className="text-[7px] text-emerald-600 font-bold mt-0.5">Validado DGII</p>
            </div>

            <div className="space-y-1">
              {[
                ["Huevos A x 40", "7,200.00"],
                ["Huevos B x 12", "1,800.00"],
                ["Pollos 2.5kg x 8", "3,360.00"],
              ].map(([d, v]) => (
                <div key={d} className="flex justify-between text-[9px]">
                  <span className="text-slate-500">{d}</span>
                  <span className="font-bold text-slate-700">{v}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-300 mt-2 pt-2 space-y-0.5">
              <div className="flex justify-between text-[8px]">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold">{formatDOP(12360)}</span>
              </div>
              <div className="flex justify-between text-[8px]">
                <span className="text-slate-500">ITBIS 18%</span>
                <span className="font-bold">{formatDOP(2225)}</span>
              </div>
              <div className="flex justify-between text-xs font-black mt-1">
                <span>TOTAL</span>
                <span style={{ color: mockupTheme.primary }}>{formatDOP(14585)}</span>
              </div>
            </div>

            {/* Barcode */}
            <div className="mt-2 flex gap-[1px] h-6 items-center justify-center">
              {barcode.map((bar, i) => (
                <div
                  key={i}
                  className="bg-slate-800"
                  style={{
                    width: bar.width,
                    height: bar.height,
                    opacity: bar.opacity,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            className="rounded-lg py-2 text-[9px] font-black text-white flex items-center justify-center gap-1"
            style={{ background: mockupTheme.primary }}
          >
            <FileText className="w-3 h-3" /> PDF
          </button>
          <button className="rounded-lg py-2 text-[9px] font-black border border-slate-200 text-slate-700 flex items-center justify-center gap-1">
            <Download className="w-3 h-3" /> Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
