import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, X, Users, ArrowRight, Shield } from "lucide-react"
import { plans, getFormattedPrice, getSavings, periodLabels } from "@/data/pricing"
import type { PricingPeriod, Plan } from "@/types/pricing"

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<PricingPeriod>("quarterly")
  const navigate = useNavigate()

  const handlePlanSelect = (planId: string) => {
    if (planId === 'hacienda') {
      // Contact sales for enterprise
      window.location.href = 'mailto:ventas@gallinapp.com?subject=Interesado en Plan Hacienda'
    } else {
      navigate(`/auth/signup?plan=${planId}&period=${billingCycle}`)
    }
  }

  const paidPlans = plans.filter(p => !p.isFree)
  const freePlan = plans.find(p => p.isFree)

  return (
    <Section id="precios" background="canvas" padding="lg" className="relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-100/50 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/30 to-transparent rounded-full blur-3xl -z-10" />

      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-semibold text-cyan-700">Planes transparentes</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 leading-tight">
            Un plan para cada
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent"> etapa de tu granja</span>
          </h2>
          
          <p className="text-lg text-stripe-text mb-8">
            Sin sorpresas ni contratos ocultos. Cambia o cancela cuando quieras.
            <br />
            <span className="font-bold text-cyan-600">Todos los planes incluyen 14 días de prueba gratuita.</span>
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center p-1.5 bg-white rounded-2xl shadow-lg border border-stripe-border">
            {(['monthly', 'quarterly', 'annual'] as PricingPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setBillingCycle(period)}
                className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  billingCycle === period 
                    ? "bg-brand-dark text-white shadow-md" 
                    : "text-stripe-muted hover:text-brand-dark"
                }`}
              >
                {periodLabels[period]}
                {period === 'quarterly' && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-black uppercase">
                    -17%
                  </span>
                )}
                {period === 'annual' && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase">
                    -58%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
          {paidPlans.map((plan, i) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              period={billingCycle}
              onSelect={() => handlePlanSelect(plan.id)}
              delay={i * 100}
            />
          ))}
        </div>

        {/* Free Plan Section */}
        {freePlan && (
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-200/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-brand-dark">{freePlan.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase">
                      Gratis
                    </span>
                  </div>
                  <p className="text-stripe-text mb-4">
                    {freePlan.description}. Ideal para empleados y trabajadores que necesitan acceso a la plataforma sin ser propietarios de una granja.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {freePlan.features.slice(0, 4).map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-sm text-stripe-text">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline"
                  onClick={() => handlePlanSelect('free')}
                  className="flex-shrink-0 h-12 px-6 rounded-xl font-bold border-2 border-slate-300 hover:border-cyan-500 hover:bg-cyan-50 transition-all group"
                >
                  Crear cuenta gratis
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Trust Section */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-16 border-t border-stripe-border">
          <div className="flex items-center gap-2 text-stripe-muted">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Datos 100% seguros</span>
          </div>
          <div className="flex items-center gap-2 text-stripe-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-medium">Encriptación SSL</span>
          </div>
          <div className="flex items-center gap-2 text-stripe-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">Cancela cuando quieras</span>
          </div>
        </div>
      </Container>
    </Section>
  )
}

// Pricing Card Component
interface PricingCardProps {
  plan: Plan
  period: PricingPeriod
  onSelect: () => void
  delay?: number
}

function PricingCard({ plan, period, onSelect, delay = 0 }: PricingCardProps) {
  const Icon = plan.icon
  const price = getFormattedPrice(plan, period)
  const savings = getSavings(plan, period)
  const periodLabel = plan.pricing[period]?.label || '/mes'
  
  return (
    <div 
      className={`relative flex flex-col p-8 rounded-3xl transition-all duration-500 ${
        plan.popular 
          ? "bg-gradient-to-b from-white to-cyan-50/50 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-[1.03] z-10" 
          : "bg-white border-2 border-stripe-border hover:border-cyan-300 hover:shadow-xl"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-xs font-bold uppercase tracking-wide shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Más Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-brand-dark">{plan.name}</h3>
            {plan.nameEn !== plan.name && (
              <span className="text-xs text-stripe-muted">{plan.nameEn}</span>
            )}
          </div>
        </div>
        
        <p className="text-stripe-text text-sm mb-6">{plan.description}</p>
        
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-brand-dark">{price}</span>
          <span className="text-stripe-muted font-medium">{periodLabel}</span>
        </div>
        
        {/* Savings Badge */}
        {savings && (
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
            <Check className="w-3 h-3" />
            {savings}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              plan.popular ? 'bg-cyan-100' : 'bg-green-100'
            }`}>
              <Check className={`w-3 h-3 ${plan.popular ? 'text-cyan-600' : 'text-green-600'}`} />
            </div>
            <span className="text-sm text-stripe-text">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Limitations for free plan */}
      {plan.limitations && plan.limitations.length > 0 && (
        <ul className="space-y-2 mb-8 pt-4 border-t border-stripe-border">
          {plan.limitations.map((limitation, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-stripe-muted">{limitation}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <Button 
        onClick={onSelect}
        className={`w-full h-14 rounded-xl font-bold text-base transition-all group ${
          plan.popular 
            ? "bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl" 
            : "bg-white border-2 border-stripe-border hover:border-cyan-500 hover:bg-cyan-50 text-brand-dark"
        }`}
      >
        {plan.cta}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  )
}
