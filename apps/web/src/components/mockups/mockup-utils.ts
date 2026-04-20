/**
 * Helpers para mockups dinamicos del landing.
 * Replica los colores y tipografia de la app mobile real.
 */

export const mockupTheme = {
  // De /apps/mobile/src/constants/designSystem.ts
  primary: "#345DAD",
  primaryLight: "#5B7DC4",
  secondary: "#35354C",
  success: "#2E7D32",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",
  egg: "#FFD700",
  chicken: "#D2B48C",
  feed: "#8B4513",
  health: "#4CAF50",
  surface: "#F8F9FB",
  border: "#E5E7EB",
  text: "#1F2937",
  muted: "#6B7280",
} as const

export function formatDOP(value: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-DO").format(value)
}
