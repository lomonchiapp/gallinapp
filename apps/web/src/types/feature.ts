import { LucideIcon } from "lucide-react"

export interface Stat {
  label: string
  value: string
}

export interface MainFeature {
  icon: LucideIcon
  title: string
  description: string
  badge: string
  gradient: string
  bgColor: string
  stats: Stat[]
}

export interface SecondaryFeature {
  icon: LucideIcon
  title: string
  description: string
  badge: string
  color: string
}

export interface Highlight {
  icon: LucideIcon
  text: string
  color: string
}









