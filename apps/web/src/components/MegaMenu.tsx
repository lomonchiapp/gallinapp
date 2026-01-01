import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface MegaMenuProps {
  title: string
  align?: "left" | "center" | "right"
  items: {
    title: string
    description: string
    icon: React.ElementType
    href: string
  }[]
}

export function MegaMenu({ title, align = "center", items }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const alignClasses = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0"
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isOpen])

  const renderItem = (item: MegaMenuProps["items"][0]) => {
    const Icon = item.icon
    const content = (
      <div className="flex items-start gap-4 text-left">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:scale-110 transition-all duration-300 shrink-0 shadow-sm border border-slate-100 group-hover:border-brand-primary/20">
          <Icon className="h-5 w-5 text-slate-600 group-hover:text-brand-primary transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors mb-1 text-sm tracking-tight flex items-center gap-1.5">
            {item.title}
          </h3>
          <p className="text-[11px] text-slate-500 leading-snug group-hover:text-slate-600 transition-colors">
            {item.description}
          </p>
        </div>
      </div>
    )

    const isExternal = item.href.startsWith("http") || item.href.startsWith("#")
    const className = "group p-4 rounded-2xl hover:bg-slate-50/80 transition-all duration-300 border border-transparent hover:border-slate-200 hover:shadow-sm block"

    if (isExternal) {
      return (
        <a
          key={item.title}
          href={item.href}
          className={className}
          onClick={() => setIsOpen(false)}
        >
          {content}
        </a>
      )
    }

    return (
      <Link
        key={item.title}
        to={item.href}
        className={className}
        onClick={() => setIsOpen(false)}
      >
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
          isOpen ? "text-brand-primary" : "text-slate-600 hover:text-slate-900"
        )}
      >
        {title}
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-300",
          isOpen ? "rotate-180 text-brand-primary" : "text-slate-400 group-hover:text-slate-600"
        )} />
        <span className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-brand-primary transition-all duration-300",
          isOpen ? "w-full" : "w-0 group-hover:w-1/2"
        )}></span>
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full left-0 w-full h-4 bg-transparent z-40" />
          
          <div
            className={cn(
              "absolute top-[calc(100%+8px)] w-[640px] bg-white rounded-[2rem] shadow-premium border border-slate-100 p-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300",
              alignClasses[align]
            )}
          >
            <div className="grid grid-cols-2 gap-4">
              {items.map(renderItem)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
