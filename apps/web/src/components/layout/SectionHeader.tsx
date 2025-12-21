import { cn } from "@/lib/utils"
import { ReactNode } from "react"
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
  align?: "left" | "center" | "right"
  className?: string
}

export function SectionHeader({
  badge,
  title,
  titleHighlight,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
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

      <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight">
        {typeof title === "string" ? (
          <>
            {title}
            {titleHighlight && (
              <span className="block mt-2 text-primary-500">
                {titleHighlight}
              </span>
            )}
          </>
        ) : (
          title
        )}
      </h2>

      {description && (
        <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}








