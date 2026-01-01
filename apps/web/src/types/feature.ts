import { type LucideProps } from "lucide-react"
import { type ComponentType } from "react"

export interface Stat {
  label: string
  value: string
}

export interface MainFeature {
  icon: ComponentType<LucideProps>
  title: string
  description: string
  badge: string
  gradient: string
  bgColor: string
  stats: Stat[]
}

export interface SecondaryFeature {
  icon: ComponentType<LucideProps>
  title: string
  description: string
  badge: string
  color: string
}

export interface Highlight {
  icon: ComponentType<LucideProps>
  text: string
  color: string
}









