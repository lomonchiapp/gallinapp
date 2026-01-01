import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import { SUBSCRIPTION_PRICING, SubscriptionPlan } from "@gallinapp/types"

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "annual">("annual")
  const navigate = useNavigate()

  const handlePlanSelect = () => {
    navigate('/auth/signup')
  }

  const plans = Object.entries(SUBSCRIPTION_PRICING).map(([key, plan]) => {
    const pricing = plan[billingCycle];
    return {
      name: key.charAt(0) + key.slice(1).toLowerCase(),
      price: `$${pricing.price}`,
      period: billingCycle === "monthly" ? "/mes" : (billingCycle === "quarterly" ? "/trimestre" : "/año"),
      description: plan.description,
      features: plan.features,
      cta: plan.popular || key === 'basic' ? "Prueba 15 días gratis" : "Contactar ventas",
      popular: plan.popular,
      savings: pricing.savingsLabel,
    };
  });

  return (
    <Section id="precios" background="canvas" padding="lg">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-4">
            Precios
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
            Planes flexibles para <br /> cualquier escala.
          </h3>
          <p className="text-lg text-stripe-text mb-10">
            Sin contratos ocultos ni sorpresas. Cambia de plan en cualquier momento.
            <br />
            <span className="font-bold text-brand-primary">¡Todos los planes incluyen 15 días de prueba gratuita!</span>
          </p>

          {/* Billing Triple Switch */}
          <div className="inline-flex items-center p-1 bg-stripe-border/50 rounded-2xl mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                billingCycle === "monthly" ? "bg-white text-brand-dark shadow-md" : "text-stripe-muted hover:text-brand-dark"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle("quarterly")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all relative ${
                billingCycle === "quarterly" ? "bg-white text-brand-dark shadow-md" : "text-stripe-muted hover:text-brand-dark"
              }`}
            >
              Trimestral
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-brand-primary text-white text-[8px] font-black uppercase tracking-wider">
                -8%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all relative ${
                billingCycle === "annual" ? "bg-white text-brand-dark shadow-md" : "text-stripe-muted hover:text-brand-dark"
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-green-500 text-white text-[8px] font-black uppercase tracking-wider">
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative p-8 md:p-10 rounded-[2rem] border transition-all duration-300 flex flex-col ${
                plan.popular 
                  ? "bg-white border-brand-primary shadow-floating scale-105 z-10" 
                  : "bg-transparent border-stripe-border hover:border-brand-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Más Popular
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-xl font-bold text-brand-dark mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-brand-dark">{plan.price}</span>
                  {plan.name !== "Enterprise" && (
                    <span className="text-stripe-muted font-medium">{plan.period}</span>
                  )}
                </div>
                {plan.savings && (
                  <div className="text-green-600 text-xs font-bold mt-1">
                    {plan.savings}
                  </div>
                )}
                <p className="text-sm text-stripe-text mt-4 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium text-stripe-heading">
                    <Check className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

                  <Button 
                    onClick={handlePlanSelect}
                    className={`w-full h-12 rounded-xl font-bold transition-all ${
                      plan.popular 
                        ? "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-md" 
                        : "bg-white border-2 border-stripe-border hover:border-brand-primary text-stripe-heading"
                    }`}
                  >
                    {plan.cta}
                  </Button>
            </div>
          ))}
        </div>

        {/* Free Plan Call to Action */}
        <div className="max-w-3xl mx-auto p-8 rounded-[2rem] bg-stripe-border/20 border border-stripe-border text-center">
          <h4 className="text-xl font-bold text-brand-dark mb-2">¿Solo vienes a colaborar?</h4>
          <p className="text-stripe-text mb-6">
            Si vas a trabajar en la granja de otro propietario, no necesitas un plan de pago. 
            El plan gratuito es ideal para colaboradores y observadores.
          </p>
              <button 
                onClick={handlePlanSelect}
                className="inline-flex items-center gap-2 text-brand-primary font-black hover:opacity-70 transition-opacity underline underline-offset-4"
              >
                Quiero suscribirme con el plan Gratuito
              </button>
        </div>
      </Container>
    </Section>
  )
}
