import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

interface SectionHeaderProps {
  badge?: {
    text: string
    icon?: ReactNode
    className?: string
  }
  title: string | ReactNode
  titleHighlight?: string
  description?: string
  subtitle?: string // Alias para description
  align?: "left" | "center" | "right"
  className?: string
  dark?: boolean // Nueva prop para fondos oscuros
}

export function SectionHeader({
  badge,
  title,
  titleHighlight,
  description,
  subtitle,
  align = "center",
  className,
  dark = false,
}: SectionHeaderProps) {
  const finalDescription = description || subtitle
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }

  return (
    <div
      className={cn(
        "flex flex-col mb-16 md:mb-20 px-4 md:px-6",
        alignClasses[align],
        className
      )}
    >
      {badge && (
        <div className="mb-6">
          <Badge className={cn("mb-4", badge.className)}>
            {badge.icon && <span className="mr-2">{badge.icon}</span>}
            {badge.text}
          </Badge>
        </div>
      )}

      <h2 className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight",
        dark ? "text-white" : "text-secondary-600"
      )}>
        {typeof title === "string" ? (
          <>
            {title}
            {titleHighlight && (
              <span className="text-primary-500">
                {" "}{titleHighlight}
              </span>
            )}
          </>
        ) : (
          title
        )}
      </h2>

      {finalDescription && (
        <p className={cn(
          "text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium",
          dark ? "text-slate-300" : "text-secondary-400"
        )}>
          {finalDescription}
        </p>
      )}
    </div>
  )
}









