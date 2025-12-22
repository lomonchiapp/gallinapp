import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { PricingCard } from "./PricingCard"
import { usePricing } from "@/hooks/usePricing"
import { Badge } from "@/components/ui/badge"

export function Pricing() {
  const { plans } = usePricing()

  return (
    <Section id="precios" background="gradient" padding="lg">
      <Container size="xl">
        <SectionHeader
          badge={{
            text: "Precios",
            className: "mb-4 bg-success-500 text-white border-0 shadow-md",
          }}
          title="Planes que se adaptan a tu negocio"
          description="Elige el plan perfecto para tu granja. Puedes cambiar o cancelar en cualquier momento."
          align="center"
          className="mb-16"
        />
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
          style={{
            paddingTop: "17px",
            paddingBottom: "17px",
            marginTop: "19px",
            marginBottom: "19px",
          }}
        >
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </Container>
    </Section>
  )
}









