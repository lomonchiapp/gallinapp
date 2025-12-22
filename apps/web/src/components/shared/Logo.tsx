import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "line" | "white" | "icon"
  className?: string
  height?: number
}

const logoPaths = {
  line: "/images/full-logo-line.png",
  white: "/images/full-logo-white.png",
  icon: "/images/icon.png",
}

export function Logo({ variant = "line", className, height = 40 }: LogoProps) {
  return (
    <img
      src={logoPaths[variant]}
      alt="Gallinapp"
      className={cn("w-auto", className)}
      style={{ height: `${height}px` }}
    />
  )
}









