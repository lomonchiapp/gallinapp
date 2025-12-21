import { TrendingUp, Zap, DollarSign, Globe } from "lucide-react"
import type { Benefit, Stat } from "@/types/benefit"

export const benefits: Benefit[] = [
  {
    icon: TrendingUp,
    title: "Productividad Multiplicada",
    description: "Automatización inteligente que reduce el tiempo de registro manual en un 70% y libera a tu equipo para tareas estratégicas",
    metric: "70%",
    metricLabel: "Más eficiencia",
    iconBg: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Zap,
    title: "Precisión Absoluta",
    description: "Validaciones automáticas y cálculos precisos eliminan errores humanos y garantizan datos 100% confiables",
    metric: "99.9%",
    metricLabel: "Precisión",
    iconBg: "from-amber-500 to-amber-600"
  },
  {
    icon: DollarSign,
    title: "ROI Comprobado",
    description: "Análisis detallado de costos y ganancias que optimiza tus operaciones y maximiza la rentabilidad",
    metric: "+45%",
    metricLabel: "Rentabilidad",
    iconBg: "from-green-500 to-green-600"
  },
  {
    icon: Globe,
    title: "Movilidad Total",
    description: "Acceso desde cualquier dispositivo con sincronización en tiempo real. Tu granja siempre contigo",
    metric: "24/7",
    metricLabel: "Disponibilidad",
    iconBg: "from-blue-400 to-blue-500"
  }
]

export const stats: Stat[] = [
  { value: "10K+", label: "Granjas activas" },
  { value: "50M+", label: "Aves gestionadas" },
  { value: "98%", label: "Satisfacción" },
  { value: "4.8/5", label: "Valoración" }
]








