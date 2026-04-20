import { type LucideProps } from "lucide-react"
import { type ComponentType } from "react"

export type PricingPeriod = 'monthly' | 'quarterly' | 'annual'

export interface PlanPricing {
  price: number
  label: string
  savings?: string
  stripePriceId?: string
}

export interface Plan {
  id: string
  name: string
  nameEn: string
  description: string
  icon: ComponentType<LucideProps>
  features: string[]
  limitations?: string[]
  cta: string
  popular: boolean
  gradient: string
  pricing: {
    monthly?: PlanPricing
    quarterly?: PlanPricing
    annual?: PlanPricing
  }
  isFree?: boolean
}

export interface PricingState {
  selectedPeriod: PricingPeriod
  setSelectedPeriod: (period: PricingPeriod) => void
}
