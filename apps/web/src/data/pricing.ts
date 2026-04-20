import { Users, Rocket, Sparkles, Crown } from "lucide-react"
import type { Plan } from "@/types/pricing"

/**
 * Planes de suscripción oficiales de GallinApp
 * Alineados con packages/types/subscription.ts
 * 
 * PRECIOS OFICIALES (USD):
 * - FREE/Colaborador: $0 (solo colaborador)
 * - BASIC: $39.99/mes, $99.99/trimestre, $199.99/año
 * - PRO: $49.99/mes, $124.99/trimestre, $249.99/año
 * - HACIENDA: $99.99/mes, $249.99/trimestre, $499.99/año
 */

export const plans: Plan[] = [
  {
    id: "free",
    name: "Colaborador",
    nameEn: "Collaborator",
    description: "Únete al equipo de una granja existente",
    icon: Users,
    features: [
      "Acceso como colaborador",
      "Únete a granjas existentes",
      "Registra producción diaria",
      "Registra mortalidad",
      "Interfaz móvil completa"
    ],
    limitations: [
      "No puedes crear granjas propias",
      "Necesitas ser invitado",
      "Sin acceso a reportes"
    ],
    cta: "Crear cuenta gratis",
    popular: false,
    gradient: "from-slate-400 to-slate-500",
    isFree: true,
    pricing: {
      monthly: {
        price: 0,
        label: "Gratis para siempre"
      }
    }
  },
  {
    id: "basic",
    name: "Básico",
    nameEn: "Basic",
    description: "Tu primera granja digital",
    icon: Rocket,
    features: [
      "1 granja propia",
      "2 colaboradores",
      "5 lotes por tipo de ave",
      "Registros de mortalidad",
      "Registros de producción",
      "Cálculos de producción",
      "Cálculos de costos",
      "Gestión de galpones",
      "Módulo de gastos",
      "Exportación de datos",
      "Soporte por email"
    ],
    cta: "Comenzar ahora",
    popular: false,
    gradient: "from-primary-500 to-primary-600",
    pricing: {
      monthly: {
        price: 39.99,
        label: "/mes",
        stripePriceId: "price_basic_monthly"
      },
      quarterly: {
        price: 99.99,
        label: "/trimestre",
        savings: "Ahorra 17%",
        stripePriceId: "price_basic_quarterly"
      },
      annual: {
        price: 199.99,
        label: "/año",
        savings: "Ahorra 58%",
        stripePriceId: "price_basic_annual"
      }
    }
  },
  {
    id: "pro",
    name: "Gallinapp Pro",
    nameEn: "Gallinapp Pro",
    description: "Para granjas en crecimiento",
    icon: Sparkles,
    features: [
      "Todo lo del plan Básico",
      "3 granjas",
      "10 colaboradores",
      "20 lotes por tipo de ave",
      "Módulo de inventario",
      "Módulo de ventas",
      "Facturación electrónica",
      "Acceso API",
      "Reportes personalizados",
      "Soporte prioritario",
      "Análisis avanzado"
    ],
    cta: "Actualizar a Pro",
    popular: true,
    gradient: "from-primary-500 to-primary-700",
    pricing: {
      monthly: {
        price: 49.99,
        label: "/mes",
        stripePriceId: "price_pro_monthly"
      },
      quarterly: {
        price: 124.99,
        label: "/trimestre",
        savings: "Ahorra 17%",
        stripePriceId: "price_pro_quarterly"
      },
      annual: {
        price: 249.99,
        label: "/año",
        savings: "Ahorra 58%",
        stripePriceId: "price_pro_annual"
      }
    }
  },
  {
    id: "hacienda",
    name: "Hacienda",
    nameEn: "Estate Plus",
    description: "Para operaciones a gran escala",
    icon: Crown,
    features: [
      "Todo lo del plan Pro",
      "10 granjas",
      "50 colaboradores",
      "Lotes ilimitados",
      "Almacenamiento 50GB",
      "Reportes personalizados",
      "Soporte dedicado 24/7",
      "Gestor de cuenta",
      "Integraciones personalizadas",
      "Capacitación incluida",
      "SLA garantizado"
    ],
    cta: "Contactar ventas",
    popular: false,
    gradient: "from-emerald-500 to-teal-600",
    pricing: {
      monthly: {
        price: 99.99,
        label: "/mes",
        stripePriceId: "price_hacienda_monthly"
      },
      quarterly: {
        price: 249.99,
        label: "/trimestre",
        savings: "Ahorra 17%",
        stripePriceId: "price_hacienda_quarterly"
      },
      annual: {
        price: 499.99,
        label: "/año",
        savings: "Ahorra 58%",
        stripePriceId: "price_hacienda_annual"
      }
    }
  }
]

// Helper para obtener el precio formateado según el periodo
export function getFormattedPrice(plan: Plan, period: 'monthly' | 'quarterly' | 'annual'): string {
  if (plan.isFree) return "$0"
  const pricing = plan.pricing[period]
  if (!pricing) return "—"
  return `$${pricing.price.toFixed(2)}`
}

// Helper para obtener el ahorro
export function getSavings(plan: Plan, period: 'monthly' | 'quarterly' | 'annual'): string | undefined {
  if (plan.isFree) return undefined
  return plan.pricing[period]?.savings
}

// Textos de los periodos
export const periodLabels = {
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  annual: 'Anual'
}
