import { motion } from "framer-motion"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { Sparkles, Smartphone, BarChart3, DollarSign, ArrowRight } from "lucide-react"

/**
 * Sección "Cómo funciona" — 3 pasos animados que muestran el ciclo:
 * registrar -> visualizar -> decidir.
 */
export function Workflow() {
  const steps = [
    {
      icon: Smartphone,
      num: "01",
      title: "Registra desde el galpón",
      desc: "Tu operario captura mortalidad, postura, peso y vacunas en segundos desde el celular, incluso sin internet.",
      color: "from-sky-500 to-blue-600",
    },
    {
      icon: BarChart3,
      num: "02",
      title: "Gallinapp procesa todo",
      desc: "Calculamos costo por huevo, FCR, % postura, mortalidad acumulada y proyecciones — automáticamente.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: DollarSign,
      num: "03",
      title: "Tú decides con datos",
      desc: "Ves ingresos, márgenes y alertas en vivo. Vendes, facturas (NCF) y cobras desde la misma app.",
      color: "from-emerald-500 to-teal-600",
    },
  ]

  return (
    <Section id="como-funciona" background="canvas" padding="lg" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl" />
      </div>
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Así trabaja Gallinapp</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 leading-tight">
            De la jaula al{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              estado de resultados
            </span>{" "}
            en tiempo real.
          </h2>
          <p className="text-lg text-stripe-text">
            Sin libretas, sin Excel, sin esperar al cierre del mes para saber cómo va tu granja.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-sky-300 via-amber-300 to-emerald-300 -z-10" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="relative inline-block mb-6">
                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl mx-auto`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-2 border-stripe-border text-brand-dark font-black text-sm flex items-center justify-center shadow-md">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-3">{step.title}</h3>
                <p className="text-stripe-text leading-relaxed">{step.desc}</p>

                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-6 top-10 w-6 h-6 text-stripe-muted" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
