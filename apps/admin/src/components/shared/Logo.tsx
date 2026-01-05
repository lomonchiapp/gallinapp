import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "default" | "white"
  showBadge?: boolean
  className?: string
}

export function Logo({ variant = "default", showBadge = false, className }: LogoProps) {
  const isWhite = variant === "white"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={isWhite ? "/images/icon-white.png" : "/images/icon.png"}
        alt="Gallinapp"
        className="h-8 w-8"
      />
      <span className={cn("text-xl font-bold", isWhite ? "text-white" : "text-slate-900")}>
        Gallin<span className={isWhite ? "text-blue-200" : "text-primary-500"}>app</span>
      </span>
      {showBadge && (
        <span className={cn(
          "ml-1 rounded px-1.5 py-0.5 text-xs font-medium",
          isWhite ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"
        )}>
          Admin
        </span>
      )}
    </div>
  )
}
