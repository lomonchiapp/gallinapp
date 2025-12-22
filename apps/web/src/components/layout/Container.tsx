import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  className?: string
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[1536px]",
  full: "max-w-full",
}

export function Container({ children, size = "xl", className }: ContainerProps) {
  return (
    <div
      className={cn(
        "container mx-auto px-6 md:px-8 lg:px-12",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}









