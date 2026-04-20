import { motion } from "framer-motion"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { PhoneFrame, FacturacionMockup, MultiGranjaMockup } from "@/components/mockups"
import { Check, FileText, MapPin, Shield, ArrowRight } from "lucide-react"

/**
 * Dos "spotlight" full-width para destacar features diferenciadoras:
 *  1. Facturación con NCF (Dominican tax receipts)
 *  2. Multi-granja con colaboradores
 */
export function Spotlight() {
  return (
    <>
      {/* Spotlight 1 — Facturación NCF */}
      <Section background="dark" padding="lg" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6 relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30">
                <FileText className="w-4 h-4 text-rose-300" />
                <span className="text-xs font-bold text-rose-200 uppercase tracking-wider">
                  Exclusivo República Dominicana
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Factura con{" "}
                <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">
                  NCF válido ante la DGII
                </span>
                , sin salir de la app.
              </h2>

              <p className="text-lg text-white/70 leading-relaxed">
                Controlamos la secuencia de tus comprobantes fiscales, calculamos el ITBIS,
                generamos el PDF con tu logo y datos de la granja, y lo enviamos al cliente.
                Todo desde el celular.
              </p>

              <ul className="space-y-3">
                {[
                  "Secuencia NCF por tipo de comprobante (B01, B02, B14, B15)",
                  "RNC del cliente validado en el formulario",
                  "Cálculo automático de ITBIS 18% y retenciones",
                  "Duplicados y notas de crédito con trazabilidad",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-rose-300" />
                    </div>
                    <span className="text-white/80">{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] rounded-full bg-rose-500/30 blur-[100px]" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
              >
                <PhoneFrame label="NCF" tilt="right" floating>
                  <FacturacionMockup />
                </PhoneFrame>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Spotlight 2 — Multi-Granja */}
      <Section background="white" padding="lg" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-3xl" />
        </div>

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative flex justify-center order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10"
              >
                <PhoneFrame label="Multi-Granja" tilt="left" floating>
                  <MultiGranjaMockup />
                </PhoneFrame>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 border border-violet-200">
                <MapPin className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
                  Para operaciones con varias granjas
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight">
                Una cuenta,{" "}
                <span className="bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
                  todas tus granjas.
                </span>
              </h2>

              <p className="text-lg text-stripe-text leading-relaxed">
                Gestiona hasta 10 granjas con el plan Hacienda. Cada una con sus propios lotes,
                colaboradores y reportes — pero consolidadas en un solo panel de control.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: MapPin, title: "Hasta 10 ubicaciones", text: "Cada una con su equipo, monedas y galpones." },
                  { icon: Shield, title: "Datos aislados por granja", text: "Los colaboradores solo ven lo que deben ver." },
                ].map((b) => (
                  <div key={b.title} className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
                    <b.icon className="w-5 h-5 text-violet-600 mb-2" />
                    <p className="font-bold text-brand-dark text-sm mb-1">{b.title}</p>
                    <p className="text-sm text-stripe-text">{b.text}</p>
                  </div>
                ))}
              </div>

              <a
                href="#precios"
                className="inline-flex items-center gap-2 text-violet-600 font-bold hover:gap-3 transition-all"
              >
                Ver plan Hacienda <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  )
}
