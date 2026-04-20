import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MegaMenuItem {
  title: string
  description: string
  icon: React.ElementType
  href: string
  badge?: string
}

export interface MegaMenuFeatured {
  eyebrow?: string
  title: string
  description: string
  bullets?: string[]
  ctaLabel?: string
  ctaHref?: string
}

interface MegaMenuProps {
  title: string
  items: MegaMenuItem[]
  isScrolled?: boolean
  /** Gradient class pair, e.g. "from-blue-500 to-indigo-600" */
  accent?: string
  featured?: MegaMenuFeatured
  footerNote?: string
  /** Kept for backwards-compat with existing call sites; no longer affects
   *  positioning — every mega menu is centered below its trigger to keep
   *  the landing-header behaviour consistent across sections. */
  align?: "left" | "center" | "right"
}

const DEFAULT_FOOTER =
  "15 días gratis · Sin tarjeta de crédito · Cancela cuando quieras"

export function MegaMenu({
  title,
  items,
  isScrolled = true,
  accent = "from-sky-500 to-indigo-600",
  featured,
  footerNote,
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
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

  const renderItem = (item: MegaMenuItem) => {
    const Icon = item.icon
    const isExternal = item.href.startsWith("http") || item.href.startsWith("#")

    const content = (
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all bg-gradient-to-br text-white group-hover:scale-110",
            accent
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
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">{item.description}</p>
        </div>
      </div>
    )

    const className =
      "group relative rounded-2xl p-3.5 transition-all hover:bg-slate-50 border border-transparent hover:border-slate-200 block"

    if (isExternal) {
      return (
        <a key={item.title} href={item.href} className={className} onClick={() => setIsOpen(false)}>
          {content}
        </a>
      )
    }
    return (
      <Link key={item.title} to={item.href} className={className} onClick={() => setIsOpen(false)}>
        {content}
      </Link>
    )
  }

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
            {/* Hover bridge */}
            <div className="absolute top-full left-0 w-full h-4 bg-transparent z-40" />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50",
                featured
                  ? "w-[min(960px,calc(100vw-2rem))]"
                  : "w-[min(720px,calc(100vw-2rem))]"
              )}
            >
              <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl bg-white">
                {/* Decorative glow */}
                <div
                  className={cn(
                    "absolute -top-20 -right-10 w-[400px] h-[400px] rounded-full blur-[120px] opacity-25 bg-gradient-to-br",
                    accent
                  )}
                />

                <div
                  className={cn(
                    "relative grid",
                    featured ? "grid-cols-12" : "grid-cols-1"
                  )}
                >
                  {/* Items */}
                  <div
                    className={cn(
                      "p-8",
                      featured ? "col-span-8 border-r border-slate-100" : "col-span-1"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full bg-gradient-to-r",
                          accent
                        )}
                      />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {title}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">{items.map(renderItem)}</div>
                  </div>

                  {/* Featured card */}
                  {featured && (
                    <div className="col-span-4 p-6 bg-gradient-to-br from-slate-50 to-white flex flex-col">
                      <div className="flex items-center gap-1.5 mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                          {featured.eyebrow ?? "Destacado"}
                        </p>
                      </div>

                      <div className="relative rounded-2xl overflow-hidden p-5 text-white mb-4 bg-gradient-to-br from-brand-dark to-slate-900 flex-1">
                        <div
                          className={cn(
                            "absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl bg-gradient-to-br opacity-60",
                            accent
                          )}
                        />
                        <div className="relative">
                          <h4 className="text-lg font-black leading-tight mb-1.5">
                            {featured.title}
                          </h4>
                          <p className="text-[11px] text-white/70 leading-relaxed mb-3">
                            {featured.description}
                          </p>

                          {featured.bullets && featured.bullets.length > 0 && (
                            <div className="space-y-1 mb-4">
                              {featured.bullets.map((b) => (
                                <div
                                  key={b}
                                  className="flex items-center gap-1.5 text-[11px] text-white/90"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {featured.ctaLabel && featured.ctaHref && (
                            <Link
                              to={featured.ctaHref}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-xs font-black text-amber-300 hover:text-amber-200 transition-colors"
                            >
                              {featured.ctaLabel}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="relative border-t border-slate-100 bg-slate-50/60 px-8 py-3 flex items-center justify-between">
                  <p className="text-[11px] text-slate-500">{footerNote ?? DEFAULT_FOOTER}</p>
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
