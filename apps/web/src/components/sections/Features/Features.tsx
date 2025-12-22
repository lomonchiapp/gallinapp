import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { FeatureCard } from "@/components/features/FeatureCard/FeatureCard"
import { HighlightBadge } from "@/components/features/HighlightBadge/HighlightBadge"
import { CTAButton } from "@/components/features/CTAButton/CTAButton"
import { SecondaryFeatureCard } from "./SecondaryFeatureCard"
import { useFeatures } from "@/hooks/useFeatures"
import { Sparkles } from "lucide-react"

export function Features() {
  const { mainFeatures, secondaryFeatures, highlights } = useFeatures()

  return (
    <Section id="caracteristicas" background="gradient" padding="xl">
      {/* Animated Background decorations */}
      <div
        className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: "#345DAD" }}
      ></div>
      <div
        className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: "#2E7D32" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: "#2196F3" }}
      ></div>

      <Container size="xl" className="relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-24 px-6 md:px-8">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border-2 shadow-lg mb-8"
            style={{ borderColor: "#345DAD" }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#345DAD" }}
            ></div>
            <span className="text-sm font-bold" style={{ color: "#345DAD" }}>
              PLATAFORMA EMPRESARIAL
            </span>
            <Sparkles className="h-4 w-4" style={{ color: "#FFD700" }} />
          </div>

          <SectionHeader
            title="La solución completa para"
            titleHighlight="gestión avícola profesional"
            description="Tecnología de última generación diseñada para empresas que buscan excelencia operativa"
            align="center"
            className="mb-12"
          />

          {/* Highlights Bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-12 mb-16 px-6 md:px-8">
            {highlights.map((highlight, index) => (
              <HighlightBadge key={index} {...highlight} />
            ))}
          </div>
        </div>

        {/* Main Features - Hero Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 px-6 md:px-8 mt-8">
          {mainFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Secondary Features - Modern Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 px-6 md:px-8 mt-12">
          {secondaryFeatures.map((feature) => (
            <SecondaryFeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Premium CTA */}
        <div className="mt-32 px-6 md:px-8">
          <div
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center shadow-2xl"
            style={{ backgroundColor: "#345DAD" }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                ¿Listo para transformar tu gestión avícola?
              </h3>

              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                Únete a miles de productores que ya están revolucionando su
                negocio con Gallinapp
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <CTAButton
                  text="Solicitar Demo Personalizada"
                  variant="primary"
                />
                <CTAButton text="Ver Casos de Éxito" variant="outline" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}









