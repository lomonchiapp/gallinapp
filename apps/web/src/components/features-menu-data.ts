import type { ElementType } from "react"
import {
  Egg,
  Drumstick,
  Feather,
  ShoppingCart,
  FileText,
  Wallet,
  Package,
  Building2,
  Users,
  Bell,
  Download,
} from "lucide-react"

export type PlanBadge = "Básico" | "Pro" | "Hacienda" | "Incluido"

export interface FeatureItem {
  title: string
  description: string
  icon: ElementType
  href: string
  badge?: PlanBadge
}

export interface FeatureCategory {
  id: string
  label: string
  accent: string
  items: FeatureItem[]
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: "produccion",
    label: "Producción",
    accent: "from-blue-500 to-indigo-600",
    items: [
      {
        title: "Ponedoras",
        description: "Huevos diarios, clasificación A/B/doble-yema/sucios/rotos, consumo de alimento.",
        icon: Egg,
        href: "/#modulos",
      },
      {
        title: "Engorde",
        description: "Curva de peso, FCR, mortalidad y listos para venta.",
        icon: Drumstick,
        href: "/#modulos",
      },
      {
        title: "Levante",
        description: "Uniformidad semana a semana y cronograma sanitario.",
        icon: Feather,
        href: "/#modulos",
      },
    ],
  },
  {
    id: "comercial",
    label: "Comercial",
    accent: "from-rose-500 to-orange-500",
    items: [
      {
        title: "Ventas",
        description: "Flujo rápido cliente → productos → pago con débito automático.",
        icon: ShoppingCart,
        href: "/#modulos",
        badge: "Pro",
      },
      {
        title: "Facturación NCF",
        description: "Numeración fiscal DGII validada e ITBIS 18%.",
        icon: FileText,
        href: "/#modulos",
        badge: "Pro",
      },
      {
        title: "Gastos",
        description: "Categorías, lotes y donut con el gasto real del mes.",
        icon: Wallet,
        href: "/#modulos",
        badge: "Básico",
      },
      {
        title: "Inventario Pro",
        description: "Stock multi-almacén con alertas de nivel bajo.",
        icon: Package,
        href: "/#modulos",
        badge: "Pro",
      },
    ],
  },
  {
    id: "plataforma",
    label: "Plataforma",
    accent: "from-violet-500 to-fuchsia-600",
    items: [
      {
        title: "Multi-Granja",
        description: "Hasta 10 granjas con datos independientes en una cuenta.",
        icon: Building2,
        href: "/#modulos",
        badge: "Hacienda",
      },
      {
        title: "Colaboradores",
        description: "Invita tu equipo con roles Admin, Operario y Contador.",
        icon: Users,
        href: "/#modulos",
        badge: "Pro",
      },
      {
        title: "Alertas",
        description: "Push en tiempo real de producción, mortalidad y stock.",
        icon: Bell,
        href: "/#modulos",
      },
      {
        title: "Reportes",
        description: "Exporta PDF y Excel listos para tu contador.",
        icon: Download,
        href: "/#modulos",
      },
    ],
  },
]

export const BADGE_STYLES: Record<PlanBadge, string> = {
  Incluido: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Básico: "bg-sky-50 text-sky-700 border-sky-200",
  Pro: "bg-violet-50 text-violet-700 border-violet-200",
  Hacienda: "bg-amber-50 text-amber-700 border-amber-200",
}

export const featuresFlatList = FEATURE_CATEGORIES.flatMap((c) =>
  c.items.map((i) => ({ ...i, category: c.label }))
)
