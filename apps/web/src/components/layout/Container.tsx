import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
}

export function Container({ children, size = "xl", className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-12 lg:px-16",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}
