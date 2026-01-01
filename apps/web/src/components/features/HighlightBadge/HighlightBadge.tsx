import { cn } from "@/lib/utils"
import { type LucideProps } from "lucide-react"
import { type ComponentType } from "react"

interface HighlightBadgeProps {
  text: string
  icon: ComponentType<LucideProps>
  color: string
  className?: string
}

export function HighlightBadge({
  text,
  icon: Icon,
  color,
  className,
}: HighlightBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border-2 border-neutral-100 hover:shadow-xl transition-all hover:-translate-y-1",
        className
      )}
    >
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-sm md:text-base font-bold" style={{ color: "#35354C" }}>
        {text}
      </span>
    </div>
  )
}









