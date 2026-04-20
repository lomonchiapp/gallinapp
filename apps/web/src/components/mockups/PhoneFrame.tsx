import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PhoneFrameProps {
  children: ReactNode
  className?: string
  /** Color del bezel del telefono */
  bezel?: "dark" | "light"
  /** Mostrar barra de status (hora, bateria) */
  statusBar?: boolean
  /** Etiqueta opcional sobre el frame (ej: nombre de modulo) */
  label?: string
  /** Inclinacion 3D del frame */
  tilt?: "none" | "left" | "right"
  /** Animacion de flotado */
  floating?: boolean
}

/**
 * Frame de iPhone realista para envolver mockups de pantallas.
 * Ligeramente inclinado y flotando, con notch y barra de status.
 */
export function PhoneFrame({
  children,
  className,
  bezel = "dark",
  statusBar = true,
  label,
  tilt = "none",
  floating = false,
}: PhoneFrameProps) {
  const tiltClass =
    tilt === "left"
      ? "lg:[transform:perspective(2000px)_rotateY(8deg)_rotateX(2deg)]"
      : tilt === "right"
      ? "lg:[transform:perspective(2000px)_rotateY(-8deg)_rotateX(2deg)]"
      : ""

  return (
    <div className={cn("relative inline-block", floating && "animate-float", className)}>
      {label && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-brand-dark text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
          {label}
        </div>
      )}
      <div
        className={cn(
          "relative mx-auto rounded-[2.5rem] p-2 shadow-2xl transition-transform duration-500",
          bezel === "dark"
            ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-b from-slate-200 via-white to-slate-200",
          tiltClass
        )}
        style={{
          width: "280px",
          height: "560px",
        }}
      >
        {/* Side buttons illusion */}
        <div className="absolute -left-1 top-20 w-1 h-8 rounded-l bg-slate-700/60" />
        <div className="absolute -left-1 top-32 w-1 h-12 rounded-l bg-slate-700/60" />
        <div className="absolute -left-1 top-48 w-1 h-12 rounded-l bg-slate-700/60" />
        <div className="absolute -right-1 top-28 w-1 h-16 rounded-r bg-slate-700/60" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-30 flex items-center justify-end pr-3">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>

          {/* Status bar */}
          {statusBar && (
            <div className="absolute top-0 left-0 right-0 h-6 px-5 flex items-center justify-between text-[10px] font-bold text-slate-900 z-20">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 16 12" className="w-3 h-2.5 fill-current">
                  <path d="M14 0H2C.9 0 0 .9 0 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM4 10H2V8h2v2zm3 0H5V6h2v4zm3 0H8V4h2v6zm3 0h-2V2h2v8z" />
                </svg>
                <svg viewBox="0 0 18 12" className="w-3.5 h-2.5 fill-current">
                  <path d="M9 0a17 17 0 0 0-9 3l1 1.5A15 15 0 0 1 9 1.5 15 15 0 0 1 17 4.5L18 3a17 17 0 0 0-9-3zM9 4a11 11 0 0 0-6 2l1 1.5A9 9 0 0 1 9 5.5 9 9 0 0 1 14 7.5L15 6a11 11 0 0 0-6-2zM9 8a5 5 0 0 0-3 1l3 3 3-3a5 5 0 0 0-3-1z" />
                </svg>
                <div className="relative w-5 h-2.5 border border-slate-900 rounded-sm">
                  <div className="absolute inset-0.5 bg-slate-900 rounded-sm" style={{ width: "70%" }} />
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-slate-900 rounded-r" />
                </div>
              </div>
            </div>
          )}

          {/* Screen content */}
          <div className={cn("relative w-full h-full", statusBar && "pt-7")}>{children}</div>
        </div>
      </div>
    </div>
  )
}
