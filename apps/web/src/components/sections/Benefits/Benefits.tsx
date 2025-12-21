import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { BenefitCard } from "./BenefitCard"
import { StatsBar } from "./StatsBar"
import { CTAButton } from "@/components/features/CTAButton/CTAButton"
import { useBenefits } from "@/hooks/useBenefits"
import { Award, Target } from "lucide-react"

export function Benefits() {
  const { benefits, stats } = useBenefits()

  return (
    <Section background="#345DAD" padding="lg" id="benefits">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <Container size="xl" className="relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-20 w-full py-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 mx-auto">
            <Award className="w-4 h-4 text-yellow-300 flex-shrink-0" />
            <span className="text-sm font-semibold text-white whitespace-nowrap">
              Resultados Comprobados
            </span>
          </div>
          <SectionHeader
            title="Transforma tu operación avícola"
            titleHighlight="con impacto medible"
            description="Miles de productores confían en Gallinapp para llevar su negocio al siguiente nivel"
            align="center"
            className="mb-8 md:mb-12"
          />

          {/* Stats bar */}
          <StatsBar stats={stats} />
        </div>

        {/* Benefits Grid */}
        <div className="flex justify-center items-start w-full mb-12 md:mb-16 px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl w-full">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.title} benefit={benefit} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative px-4 sm:px-6 flex justify-center items-center w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-5xl w-full mx-auto">
            <div className="flex flex-col items-center justify-center text-center w-full py-7">
              <div className="flex justify-center items-center mb-4 md:mb-6 w-full">
                <Target className="h-10 w-10 md:h-12 md:w-12 text-yellow-300" />
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 max-w-3xl mx-auto w-full text-center">
                ¿Listo para optimizar tu producción?
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4 w-full text-center">
                Únete a miles de productores que ya están transformando su
                gestión avícola
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full">
                <CTAButton text="Comenzar Prueba Gratuita" variant="primary" />
                <CTAButton text="Ver Demo en Vivo" variant="outline" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}








