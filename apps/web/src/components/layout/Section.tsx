import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  id?: string
  background?: "canvas" | "white" | "dark" | "transparent" | string
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  className?: string
}

const backgroundClasses: Record<string, string> = {
  canvas: "bg-stripe-canvas",
  white: "bg-white",
  dark: "bg-brand-dark text-white",
  transparent: "bg-transparent",
}

const paddingClasses = {
  none: "",
  sm: "py-12 md:py-20",
  md: "py-20 md:py-32",
  lg: "py-32 md:py-48",
  xl: "py-40 md:py-64",
}

export function Section({
  children,
  id,
  background = "canvas",
  padding = "md",
  className,
}: SectionProps) {
  const backgroundClass = backgroundClasses[background] || (background.startsWith('#') ? '' : background)
  const backgroundStyle = background.startsWith('#') ? { backgroundColor: background } : undefined
  
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        backgroundClass,
        paddingClasses[padding],
        className
      )}
      style={backgroundStyle}
    >
      {children}
    </section>
  )
}
