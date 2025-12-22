import { cn } from "@/lib/utils"
import { Download, Sparkles } from "lucide-react"

interface DownloadButtonProps {
  platform?: "ios" | "android" | "general"
  variant?: "header" | "hero" | "footer"
  className?: string
  onClick?: () => void
}

export function DownloadButton({
  platform = "general",
  variant = "header",
  className,
  onClick,
}: DownloadButtonProps) {
  const platformText = {
    ios: "Descargar para iOS",
    android: "Descargar para Android",
    general: "Descargar App",
  }

  const variantClasses = {
    header: "hidden md:inline-flex group relative overflow-hidden items-center justify-center gap-2 px-6 py-2.5 h-10 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95",
    hero: "group text-base px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all",
    footer: "gap-2 border-neutral-700 text-neutral-300 hover:bg-primary-500 hover:border-primary-500 hover:text-white",
  }

  const baseStyle = {
    backgroundColor: "#345DAD",
    boxShadow: "0 10px 15px -3px rgba(52, 93, 173, 0.3), 0 4px 6px -2px rgba(52, 93, 173, 0.2)",
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "header") {
      e.currentTarget.style.backgroundColor = "#2D5199"
      e.currentTarget.style.boxShadow =
        "0 20px 25px -5px rgba(52, 93, 173, 0.4), 0 10px 10px -5px rgba(52, 93, 173, 0.2)"
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "header") {
      e.currentTarget.style.backgroundColor = "#345DAD"
      e.currentTarget.style.boxShadow =
        "0 10px 15px -3px rgba(52, 93, 173, 0.3), 0 4px 6px -2px rgba(52, 93, 173, 0.2)"
    }
  }

  if (variant === "header") {
    return (
      <button
        className={cn(variantClasses.header, className)}
        style={baseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <span className="relative z-10 flex items-center gap-2">
          <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          <span>{platformText[platform]}</span>
          <Sparkles className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </span>
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: "#5A75B8" }}
        ></span>
      </button>
    )
  }

  return (
    <button
      className={cn(variantClasses[variant], className)}
      onClick={onClick}
    >
      <Download className="h-4 w-4" />
      {platformText[platform]}
    </button>
  )
}









