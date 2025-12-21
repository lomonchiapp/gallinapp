import { Check, Sparkles, Zap, Crown, Rocket } from "lucide-react"
import type { Plan } from "@/types/pricing"

export const plans: Plan[] = [
  {
    name: "Gratuito",
    price: "$0",
    period: "por siempre",
    description: "Perfecto para empezar",
    icon: Zap,
    features: [
      "1 lote activo",
      "1 usuario",
      "Funciones básicas",
      "Registro de producción",
      "Control de gastos básico"
    ],
    cta: "Empezar gratis",
    popular: false,
    gradient: "from-neutral-400 to-neutral-500"
  },
  {
    name: "Básico",
    price: "$19.99",
    period: "por mes",
    description: "Para granjas pequeñas",
    icon: Rocket,
    features: [
      "5 lotes activos",
      "3 usuarios",
      "Analytics avanzados",
      "Reportes exportables",
      "Notificaciones push",
      "Soporte por email"
    ],
    cta: "Comenzar ahora",
    popular: true,
    gradient: "from-primary-500 to-primary-600"
  },
  {
    name: "Pro",
    price: "$49.99",
    period: "por mes",
    description: "Para granjas medianas",
    icon: Sparkles,
    features: [
      "50 lotes activos",
      "10 usuarios",
      "API de integración",
      "Multi-ubicación",
      "Reportes personalizados",
      "Soporte prioritario",
      "Análisis predictivo"
    ],
    cta: "Actualizar a Pro",
    popular: false,
    gradient: "from-modules-levantes to-modules-ponedoras"
  },
  {
    name: "Enterprise",
    price: "$99.99",
    period: "por mes",
    description: "Para grandes operaciones",
    icon: Crown,
    features: [
      "Lotes ilimitados",
      "Usuarios ilimitados",
      "Personalización completa",
      "Soporte 24/7",
      "Capacitación incluida",
      "Gestor de cuenta dedicado",
      "Integraciones personalizadas"
    ],
    cta: "Contactar ventas",
    popular: false,
    gradient: "from-secondary-500 to-secondary-600"
  }
]








