import { type LucideProps } from "lucide-react"
import { type ComponentType } from "react"

export interface Plan {
  name: string
  price: string
  period: string
  description: string
  icon: ComponentType<LucideProps>
  features: string[]
  cta: string
  popular: boolean
  gradient: string
}









