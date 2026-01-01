import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  id?: string
  background?: "canvas" | "white" | "dark" | "transparent"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  className?: string
}

const backgroundClasses = {
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
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </section>
  )
}
