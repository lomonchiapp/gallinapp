import { cn } from "@/lib/utils"
import { LucideIcon, ArrowRight } from "lucide-react"

interface CTAButtonProps {
  text: string
  variant?: "primary" | "secondary" | "outline"
  icon?: LucideIcon
  onClick?: () => void
  className?: string
}

export function CTAButton({
  text,
  variant = "primary",
  icon: Icon,
  onClick,
  className,
}: CTAButtonProps) {
  const baseClasses =
    "group px-6 md:px-8 py-3 md:py-4 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"

  const variantClasses = {
    primary: "bg-white text-primary-600",
    secondary: "bg-primary-500 text-white hover:bg-primary-600",
    outline:
      "bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20",
  }

  return (
    <button
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      <span>{text}</span>
      {Icon ? (
        <Icon className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
      ) : (
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
      )}
    </button>
  )
}









