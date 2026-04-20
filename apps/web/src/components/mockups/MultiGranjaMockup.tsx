import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, MapPin, Users } from "lucide-react"
import { mockupTheme, formatDOP } from "./mockup-utils"

/**
 * Mockup de selector multi-granja con estadisticas comparativas.
 */
export function MultiGranjaMockup() {
  const granjas = [
    { nombre: "La Esperanza", region: "Moca", aves: 18420, ingresos: 287600, color: "#345DAD" },
    { nombre: "El Mirador", region: "Bonao", aves: 12100, ingresos: 184200, color: "#7C3AED" },
    { nombre: "San Antonio", region: "Santiago", aves: 9800, ingresos: 142000, color: "#DC2626" },
  ]

  const [active, setActive] = useState(0)
  const total = granjas.length
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % total), 2400)
    return () => clearInterval(id)
  }, [total])

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, ${granjas[active].color} 0%, #1E1B4B 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Mis granjas</p>
          <Users className="w-4 h-4" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-2"
          >
            <p className="text-[9px] opacity-80 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" /> {granjas[active].region}, RD
            </p>
            <p className="text-lg font-black">{granjas[active].nombre}</p>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <div className="rounded-md bg-white/15 p-1.5">
                <p className="text-[8px] opacity-80">Aves activas</p>
                <p className="text-sm font-black">{granjas[active].aves.toLocaleString("es-DO")}</p>
              </div>
              <div className="rounded-md bg-white/15 p-1.5">
                <p className="text-[8px] opacity-80">Ingresos mes</p>
                <p className="text-sm font-black">{formatDOP(granjas[active].ingresos)}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lista de granjas */}
      <div className="px-3 pt-3 space-y-1.5">
        <p className="text-[9px] font-bold text-slate-500 uppercase">Cambiar granja</p>
        {granjas.map((g, i) => (
          <motion.button
            key={g.nombre}
            onClick={() => setActive(i)}
            animate={{
              backgroundColor: i === active ? "#FFFFFF" : "#F8FAFC",
              borderColor: i === active ? g.color : "#E2E8F0",
            }}
            className="w-full rounded-xl p-2.5 border-2 flex items-center gap-2 text-left"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0"
              style={{ background: g.color }}
            >
              {g.nombre[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-800 truncate">{g.nombre}</p>
              <p className="text-[8px] text-slate-400">{g.region}</p>
            </div>
            {i === active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full"
                style={{ background: g.color }}
              />
            )}
          </motion.button>
        ))}

        <div className="rounded-xl p-2.5 mt-2 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${mockupTheme.primary} 0%, #1E3A8A 100%)` }}>
          <p className="text-[9px] font-black">+ Crear nueva granja</p>
          <p className="text-[8px] opacity-80">Hasta 10 con plan Hacienda</p>
        </div>
      </div>
    </div>
  )
}
