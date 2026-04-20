import { motion } from "framer-motion"
import { ChevronLeft, Crown, Shield, Eye, UserPlus } from "lucide-react"
import { mockupTheme } from "./mockup-utils"

/**
 * Mockup de gestion de colaboradores con roles (OWNER, ADMIN, VIEWER).
 */
export function ColaboradoresMockup() {
  const team = [
    { nombre: "Elvio Dominguez", rol: "Owner", icon: Crown, color: "#F59E0B", inicial: "E" },
    { nombre: "Maria Polanco", rol: "Admin", icon: Shield, color: "#345DAD", inicial: "M" },
    { nombre: "Jose Reyes", rol: "Admin", icon: Shield, color: "#345DAD", inicial: "J" },
    { nombre: "Carlos Pena", rol: "Operario", icon: Eye, color: "#10B981", inicial: "C" },
    { nombre: "Ana Tavarez", rol: "Operario", icon: Eye, color: "#10B981", inicial: "A" },
  ]

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col text-slate-800 select-none">
      <div
        className="px-3 pt-2 pb-3 text-white"
        style={{ background: `linear-gradient(135deg, ${mockupTheme.primary} 0%, #1E3A8A 100%)` }}
      >
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-[11px] font-bold">Colaboradores</p>
          <UserPlus className="w-4 h-4" />
        </div>
        <p className="text-[9px] opacity-80 mt-2">Tu equipo de granja</p>
        <p className="text-base font-black">{team.length} miembros activos</p>
      </div>

      <div className="px-3 pt-3 space-y-1.5">
        {team.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.nombre}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm flex items-center gap-2"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                style={{ background: m.color }}
              >
                {m.inicial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-800 truncate">{m.nombre}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Icon className="w-2.5 h-2.5" style={{ color: m.color }} />
                  <span className="text-[8px] font-black uppercase tracking-wider"
                    style={{ color: m.color }}>{m.rol}</span>
                </div>
              </div>
            </motion.div>
          )
        })}

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-xl p-3 text-center mt-2"
          style={{
            border: `2px dashed ${mockupTheme.primary}40`,
            background: `${mockupTheme.primary}08`,
          }}
        >
          <UserPlus className="w-4 h-4 mx-auto mb-1" style={{ color: mockupTheme.primary }} />
          <p className="text-[10px] font-black" style={{ color: mockupTheme.primary }}>
            Invitar colaborador
          </p>
          <p className="text-[8px] text-slate-500 mt-0.5">Hasta 50 con Hacienda</p>
        </motion.div>
      </div>
    </div>
  )
}
