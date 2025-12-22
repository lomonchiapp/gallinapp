import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { HeroContent } from "./HeroContent"
import { HeroPhone } from "./HeroPhone"

export function Hero() {
  return (
    <Section background="#345DAD" padding="xl" id="hero">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary-300/20"></div>
      <Container size="xl" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <HeroContent />
          <HeroPhone />
        </div>
      </Container>
    </Section>
  )
}









