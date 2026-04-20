import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { FEATURE_CATEGORIES, BADGE_STYLES } from "./features-menu-data"

interface FeaturesMegaMenuProps {
  title?: string
  isScrolled?: boolean
}

export function FeaturesMegaMenu({ title = "Funciones", isScrolled = true }: FeaturesMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoverCat, setHoverCat] = useState<string>(FEATURE_CATEGORIES[0].id)
  const menuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 180)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isOpen])

  const activeCategory = FEATURE_CATEGORIES.find((c) => c.id === hoverCat) ?? FEATURE_CATEGORIES[0]

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "text-sm font-semibold transition-all relative group flex items-center gap-1 py-2 px-1 cursor-pointer",
          isScrolled
            ? isOpen
              ? "text-brand-primary"
              : "text-slate-600 hover:text-slate-900"
            : isOpen
              ? "text-primary-300"
              : "text-white/90 hover:text-white"
        )}
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isScrolled
              ? isOpen
                ? "rotate-180 text-brand-primary"
                : "text-slate-400 group-hover:text-slate-600"
              : isOpen
                ? "rotate-180 text-primary-300"
                : "text-white/60 group-hover:text-white"
          )}
        />
        <span
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300",
            isScrolled ? "bg-brand-primary" : "bg-white",
            isOpen ? "w-full" : "w-0 group-hover:w-1/2"
          )}
        ></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="absolute top-full left-0 w-full h-4 bg-transparent z-40" />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[min(1040px,calc(100vw-2rem))] z-50"
            >
              <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl bg-white">
                {/* Decorative glow */}
                <div
                  className={cn(
                    "absolute -top-20 -right-10 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 transition-colors duration-500 bg-gradient-to-br",
                    activeCategory.accent
                  )}
                />

                <div className="relative grid grid-cols-12">
                  {/* Left: Category tabs + items */}
                  <div className="col-span-8 p-8 border-r border-slate-100">
                    {/* Category pills */}
                    <div className="flex items-center gap-1.5 mb-6">
                      {FEATURE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setHoverCat(cat.id)}
                          onClick={() => setHoverCat(cat.id)}
                          className={cn(
                            "relative px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all",
                            hoverCat === cat.id
                              ? "text-white"
                              : "text-slate-500 hover:text-slate-900"
                          )}
                        >
                          {hoverCat === cat.id && (
                            <motion.div
                              layoutId="mega-menu-pill"
                              className={cn(
                                "absolute inset-0 rounded-full bg-gradient-to-r",
                                cat.accent
                              )}
                              transition={{ type: "spring", stiffness: 420, damping: 32 }}
                            />
                          )}
                          <span className="relative z-10">{cat.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Items grid */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCategory.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="grid grid-cols-2 gap-2"
                      >
                        {activeCategory.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className="group relative rounded-2xl p-3.5 transition-all hover:bg-slate-50 border border-transparent hover:border-slate-200"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all bg-gradient-to-br text-white group-hover:scale-110",
                                    activeCategory.accent
                                  )}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <h3 className="font-black text-slate-900 text-sm tracking-tight group-hover:text-brand-primary transition-colors">
                                      {item.title}
                                    </h3>
                                    {item.badge && (
                                      <span
                                        className={cn(
                                          "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border",
                                          BADGE_STYLES[item.badge]
                                        )}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-snug">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right: Featured highlight card */}
                  <div className="col-span-4 p-6 bg-gradient-to-br from-slate-50 to-white flex flex-col">
                    <div className="flex items-center gap-1.5 mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                        Destacado
                      </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden p-5 text-white mb-4 bg-gradient-to-br from-brand-dark to-slate-900 flex-1">
                      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-500/30 blur-2xl" />
                      <div className="relative">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[9px] font-black uppercase tracking-widest mb-3">
                          <Zap className="w-2.5 h-2.5 text-amber-300" />
                          NUEVO
                        </div>
                        <h4 className="text-lg font-black leading-tight mb-1.5">
                          Facturación NCF con DGII
                        </h4>
                        <p className="text-[11px] text-white/70 leading-relaxed mb-3">
                          Genera comprobantes fiscales B01/B02 con numeración DGII validada e ITBIS
                          18% calculado automáticamente.
                        </p>

                        <div className="space-y-1 mb-4">
                          {["NCF automáticos", "ITBIS 18% RD", "PDF imprimible"].map((b) => (
                            <div
                              key={b}
                              className="flex items-center gap-1.5 text-[11px] text-white/90"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>

                        <Link
                          to="/#modulos"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-xs font-black text-amber-300 hover:text-amber-200 transition-colors"
                        >
                          Ver cómo funciona
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <Link
                      to="/#modulos"
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-brand-primary hover:shadow-md transition-all"
                    >
                      <div>
                        <p className="text-[11px] font-black text-slate-900">Todas las funciones</p>
                        <p className="text-[10px] text-slate-500">11 módulos integrados</p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="relative border-t border-slate-100 bg-slate-50/60 px-8 py-3 flex items-center justify-between">
                  <p className="text-[11px] text-slate-500">
                    <span className="font-black text-slate-700">15 días gratis</span> · Sin tarjeta
                    de crédito · Cancela cuando quieras
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Hecho en RD
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      Offline-first
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
