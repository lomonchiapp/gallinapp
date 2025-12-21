import { 
  BarChart3, 
  Shield, 
  Users, 
  DollarSign, 
  Bell, 
  Database,
  CheckCircle2,
  TrendingUp,
  Zap,
  LineChart,
  Globe,
  Lock
} from "lucide-react"
import type { MainFeature, SecondaryFeature, Highlight } from "@/types/feature"

export const mainFeatures: MainFeature[] = [
  {
    icon: Database,
    title: "Gestión Integral de Lotes",
    description: "Control completo de ponedoras, engorde y levante desde una única plataforma centralizada. Registra producción, mortalidad y crecimiento con precisión.",
    badge: "Core",
    gradient: "from-primary-500 to-primary-600",
    bgColor: "#345DAD",
    stats: [
      { label: "Tipos de lote", value: "3+" },
      { label: "Tiempo ahorrado", value: "70%" }
    ]
  },
  {
    icon: DollarSign,
    title: "Sistema Financiero Empresarial",
    description: "Facturación automática, control de gastos por categorías, análisis de rentabilidad en tiempo real y proyecciones financieras.",
    badge: "Pro",
    gradient: "from-success-500 to-success-600",
    bgColor: "#2E7D32",
    stats: [
      { label: "Precisión", value: "99.9%" },
      { label: "Automatización", value: "100%" }
    ]
  },
  {
    icon: BarChart3,
    title: "Business Intelligence Avanzado",
    description: "Dashboard ejecutivo con métricas en tiempo real, visualizaciones interactivas y reportes exportables para decisiones basadas en datos.",
    badge: "Pro",
    gradient: "from-info-500 to-info-600",
    bgColor: "#2196F3",
    stats: [
      { label: "Métricas", value: "50+" },
      { label: "Reportes", value: "20+" }
    ]
  }
]

export const secondaryFeatures: SecondaryFeature[] = [
  {
    icon: Users,
    title: "Multi-Tenant Enterprise",
    description: "Arquitectura SaaS con aislamiento total de datos, gestión avanzada de usuarios y control de permisos granular.",
    badge: "Enterprise",
    color: "#5A75B8"
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Notificaciones automáticas basadas en IA, recordatorios predictivos y alertas personalizables por WhatsApp, Email y Push.",
    badge: "Core",
    color: "#FF9800"
  },
  {
    icon: Shield,
    title: "Seguridad de Nivel Bancario",
    description: "Encriptación end-to-end, autenticación multi-factor, cumplimiento GDPR y auditorías completas de seguridad.",
    badge: "Enterprise",
    color: "#35354C"
  },
  {
    icon: Globe,
    title: "Multi-ubicación",
    description: "Gestiona múltiples granjas desde una única cuenta. Sincronización en tiempo real entre todas tus ubicaciones.",
    badge: "Pro",
    color: "#2196F3"
  },
  {
    icon: LineChart,
    title: "Análisis Predictivo",
    description: "Machine Learning para predicciones de producción, alertas tempranas de problemas y optimización de recursos.",
    badge: "Pro",
    color: "#2E7D32"
  },
  {
    icon: Lock,
    title: "Backup Automático",
    description: "Respaldo automático en la nube cada 24 horas. Recuperación de datos en segundos. 99.99% de disponibilidad.",
    badge: "Core",
    color: "#345DAD"
  }
]

export const highlights: Highlight[] = [
  { icon: TrendingUp, text: "Aumenta productividad 70%", color: "#2E7D32" },
  { icon: CheckCircle2, text: "99.9% Uptime garantizado", color: "#345DAD" },
  { icon: Zap, text: "Deploy en menos de 5 minutos", color: "#FF9800" }
]








