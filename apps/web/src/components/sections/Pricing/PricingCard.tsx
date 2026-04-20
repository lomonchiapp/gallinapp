import { Button } from "@/components/ui/button"
import { Check, X, Sparkles, ArrowRight } from "lucide-react"
import type { Plan, PricingPeriod } from "@/types/pricing"
import { getFormattedPrice, getSavings } from "@/data/pricing"

interface PricingCardProps {
  plan: Plan
  period: PricingPeriod
  onSelect: () => void
  highlighted?: boolean
}

export function PricingCard({ plan, period, onSelect, highlighted = false }: PricingCardProps) {
  const Icon = plan.icon
  const isPopular = plan.popular || highlighted
  const price = getFormattedPrice(plan, period)
  const savings = getSavings(plan, period)
  const periodLabel = plan.pricing[period]?.label || '/mes'

  return (
    <div
      className={`group relative flex flex-col transition-all duration-500 rounded-3xl overflow-hidden ${
        isPopular
          ? "bg-white border-2 border-primary-500 shadow-2xl shadow-primary-500/20 scale-[1.02]"
          : "bg-white border-2 border-stripe-border hover:border-primary-300 hover:shadow-xl"
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />
      )}

      {plan.popular && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3 h-3" />
            Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-8 pb-6">
        {/* Icon and Name */}
        <div className="flex items-start gap-4 mb-4">
          <div 
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-brand-dark">{plan.name}</h3>
            {plan.nameEn && plan.nameEn !== plan.name && (
              <p className="text-xs text-stripe-muted font-medium">{plan.nameEn}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-stripe-text mb-6">{plan.description}</p>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-black text-brand-dark tracking-tight">{price}</span>
            {!plan.isFree && (
              <span className="text-stripe-muted font-medium">{periodLabel}</span>
            )}
          </div>
          
          {/* Savings Badge */}
          {savings && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {savings}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 px-8 pb-6">
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isPopular ? 'bg-primary-100' : 'bg-green-50'
              }`}>
                <Check className={`w-3 h-3 ${isPopular ? 'text-primary-600' : 'text-green-600'}`} />
              </div>
              <span className="text-sm text-stripe-text leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Limitations */}
        {plan.limitations && plan.limitations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stripe-border">
            <p className="text-xs text-stripe-muted font-medium mb-2 uppercase tracking-wide">Limitaciones</p>
            <ul className="space-y-2">
              {plan.limitations.map((limitation, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-stripe-muted">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="p-8 pt-4">
        <Button
          onClick={onSelect}
          className={`w-full h-14 rounded-xl font-bold text-base transition-all group/btn ${
            isPopular
              ? "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
              : "bg-brand-dark hover:bg-brand-dark/90 text-white"
          }`}
        >
          {plan.cta}
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
        
        {!plan.isFree && (
          <p className="text-center text-xs text-stripe-muted mt-3">
            14 días gratis • Sin tarjeta requerida
          </p>
        )}
      </div>
    </div>
  )
}
