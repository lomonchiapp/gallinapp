import { type LucideProps } from "lucide-react"
import { type ComponentType } from "react"

export interface Benefit {
  icon: ComponentType<LucideProps>
  title: string
  description: string
  metric: string
  metricLabel: string
  iconBg: string
}

export interface Stat {
  value: string
  label: string
}









