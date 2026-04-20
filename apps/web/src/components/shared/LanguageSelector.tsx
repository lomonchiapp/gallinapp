import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
]

interface LanguageSelectorProps {
  isScrolled?: boolean
}

export function LanguageSelector({ isScrolled = true }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(languages[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
          isScrolled 
            ? "text-stripe-heading hover:bg-stripe-canvas" 
            : "text-white/90 hover:bg-white/10"
        )}
      >
        <Globe className={cn(
          "w-4 h-4 transition-colors",
          isScrolled 
            ? "text-stripe-muted group-hover:text-brand-primary" 
            : "text-white/60 group-hover:text-white"
        )} />
        <span className="hidden sm:inline">{currentLang.name}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform",
          isOpen && "rotate-180",
          isScrolled ? "text-stripe-muted" : "text-white/60"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-floating border border-stripe-border py-2 z-50 animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang)
                setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-stripe-canvas",
                currentLang.code === lang.code ? "text-brand-primary font-bold" : "text-stripe-text"
              )}
            >
              <div className="flex items-center gap-3">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLang.code === lang.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
