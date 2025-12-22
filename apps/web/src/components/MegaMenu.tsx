import { useState, useRef, useEffect } from "react"
import { BookOpen, GraduationCap, FileText, HelpCircle, ChevronDown } from "lucide-react"

interface MegaMenuProps {
  items: {
    title: string
    description: string
    icon: React.ElementType
    href: string
  }[]
}

export function MegaMenu({ items }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors relative group flex items-center gap-1"
        onMouseEnter={() => setIsOpen(true)}
      >
        Aprende
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-neutral-200 p-6 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="grid grid-cols-2 gap-6">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="group p-4 rounded-lg hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-200"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                      <Icon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary-500 group-hover:text-primary-600 transition-colors mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}









