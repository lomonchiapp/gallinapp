import { cn } from "@/lib/utils"
import { ReactNode, CSSProperties } from "react"

interface SectionProps {
  children: ReactNode
  id?: string
  background?: string | "gradient" | "white" | "primary" | "neutral"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  className?: string
  style?: CSSProperties
}

const backgroundClasses = {
  gradient: "bg-gradient-to-b from-neutral-50 via-white to-neutral-50",
  white: "bg-white",
  primary: "bg-primary-500",
  neutral: "bg-neutral-50",
}

const paddingClasses = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-20 md:py-24",
  lg: "py-24 md:py-32",
  xl: "py-32 md:py-40",
}

export function Section({
  children,
  id,
  background = "white",
  padding = "lg",
  className,
  style,
}: SectionProps) {
  const bgClass =
    typeof background === "string" && background in backgroundClasses
      ? backgroundClasses[background as keyof typeof backgroundClasses]
      : ""

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        bgClass,
        paddingClasses[padding],
        className
      )}
      style={
        typeof background === "string" && !(background in backgroundClasses)
          ? { backgroundColor: background, ...style }
          : style
      }
    >
      {children}
    </section>
  )
}








