import { cn } from "@/lib/utils"
import { type LucideProps } from "lucide-react"
import { type ComponentType } from "react"

interface StatCardProps {
  value: string
  label: string
  icon?: ComponentType<LucideProps>
  color?: string
  className?: string
}

export function StatCard({
  value,
  label,
  icon: Icon,
  color = "#345DAD",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 text-center flex flex-col items-center justify-center",
        className
      )}
    >
      {Icon && (
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center mb-2"
          style={{ backgroundColor: color }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      )}
      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
        {value}
      </div>
      <div className="text-xs md:text-sm text-white/80 font-medium">{label}</div>
    </div>
  )
}









