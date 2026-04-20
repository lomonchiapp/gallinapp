import { useState } from "react"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { ChevronDown, HelpCircle, MessageCircle, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
  category?: string
}

const faqData: FAQItem[] = [
  {
    category: "Planes y Precios",
    question: "¿Qué incluye la prueba gratuita de 14 días?",
    answer: "La prueba gratuita incluye acceso completo al plan Pro durante 14 días. No se requiere tarjeta de crédito para comenzar. Puedes explorar todas las funciones avanzadas como módulo de ventas, facturación electrónica, y gestión de hasta 3 granjas."
  },
  {
    category: "Planes y Precios",
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer: "Sí, puedes actualizar o degradar tu plan cuando quieras. Si actualizas, el cambio es inmediato y pagas la diferencia prorrateada. Si degradas, el cambio aplica al final de tu período de facturación actual."
  },
  {
    category: "Planes y Precios",
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), pagos desde la App Store (iOS) y Google Play Store (Android). Los precios incluyen impuestos locales donde aplique."
  },
  {
    category: "Planes y Precios",
    question: "¿Hay descuentos para pago anual?",
    answer: "¡Sí! Ofrecemos hasta un 58% de descuento si pagas anualmente. También hay descuentos del 17% para pagos trimestrales. Los descuentos se aplican automáticamente al seleccionar el período de facturación."
  },
  {
    category: "Funcionalidad",
    question: "¿Qué significa el plan Colaborador (Gratuito)?",
    answer: "El plan Colaborador permite a empleados y trabajadores de campo acceder a granjas de otros propietarios. Pueden registrar producción y mortalidad, pero no pueden crear granjas propias. Es ideal para equipos grandes donde solo el dueño necesita un plan de pago."
  },
  {
    category: "Funcionalidad",
    question: "¿Puedo gestionar diferentes tipos de aves?",
    answer: "Sí, Gallinapp soporta tres tipos de producción: Ponedoras (producción de huevos), Engorde (pollos de carne) y Levante (cría de pollitas). Cada tipo tiene métricas y funciones específicas optimizadas para su ciclo productivo."
  },
  {
    category: "Funcionalidad",
    question: "¿La app funciona sin internet?",
    answer: "La app móvil tiene funcionalidad offline limitada. Puedes ver tus datos y registrar información básica sin conexión. Cuando recuperes la conexión, los datos se sincronizan automáticamente con la nube."
  },
  {
    category: "Datos y Seguridad",
    question: "¿Mis datos están seguros?",
    answer: "Absolutamente. Utilizamos encriptación de grado bancario (AES-256), autenticación segura con Firebase Auth, y nuestros servidores están alojados en Google Cloud con backups automáticos diarios. Cumplimos con regulaciones internacionales de privacidad."
  },
  {
    category: "Datos y Seguridad",
    question: "¿Puedo exportar mis datos?",
    answer: "Sí, todos los planes de pago incluyen exportación de datos en formato Excel y PDF. En el plan Pro y Hacienda también tienes acceso a la API para integraciones personalizadas con tu ERP u otros sistemas."
  },
  {
    category: "Soporte",
    question: "¿Cómo puedo obtener ayuda?",
    answer: "Ofrecemos varios niveles de soporte: Centro de ayuda con tutoriales (todos los planes), soporte por email (planes de pago), soporte prioritario (Pro), y soporte 24/7 con gestor dedicado (Hacienda). También tenemos una comunidad activa en Facebook."
  },
  {
    category: "Soporte",
    question: "¿Ofrecen capacitación?",
    answer: "El plan Hacienda incluye capacitación personalizada para tu equipo. Para otros planes, tenemos video tutoriales, webinars mensuales gratuitos, y documentación detallada en nuestro centro de ayuda."
  },
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Group by category
  const categories = [...new Set(faqData.map(item => item.category))]

  return (
    <Section id="faq" background="white" padding="lg">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column - Header */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
                <HelpCircle className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Preguntas frecuentes</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
                ¿Tienes dudas?<br />
                <span className="text-primary-600">Te ayudamos</span>
              </h2>
              
              <p className="text-stripe-text mb-8">
                Encuentra respuestas a las preguntas más comunes sobre Gallinapp. 
                Si no encuentras lo que buscas, contáctanos.
              </p>

              {/* Contact Options */}
              <div className="space-y-4">
                <a 
                  href="mailto:soporte@gallinapp.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-dark">Email</div>
                    <div className="text-sm text-stripe-muted">soporte@gallinapp.com</div>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-brand-dark">WhatsApp</div>
                    <div className="text-sm text-stripe-muted">Chat en vivo</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-8">
              {categories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h3 className="text-sm font-bold text-stripe-muted uppercase tracking-widest mb-4">
                    {category}
                  </h3>
                  
                  <div className="space-y-3">
                    {faqData
                      .filter(item => item.category === category)
                      .map((item, index) => {
                        const globalIndex = faqData.findIndex(f => f.question === item.question)
                        const isOpen = openItems.includes(globalIndex)
                        
                        return (
                          <div
                            key={index}
                            className={cn(
                              "border-2 rounded-2xl transition-all duration-300",
                              isOpen 
                                ? "border-primary-200 bg-primary-50/30 shadow-lg" 
                                : "border-stripe-border bg-white hover:border-primary-100"
                            )}
                          >
                            <button
                              onClick={() => toggleItem(globalIndex)}
                              className="w-full flex items-center justify-between p-5 text-left"
                            >
                              <span className={cn(
                                "font-semibold pr-4 transition-colors",
                                isOpen ? "text-primary-700" : "text-brand-dark"
                              )}>
                                {item.question}
                              </span>
                              <ChevronDown 
                                className={cn(
                                  "w-5 h-5 flex-shrink-0 transition-transform duration-300",
                                  isOpen ? "rotate-180 text-primary-600" : "text-stripe-muted"
                                )} 
                              />
                            </button>
                            
                            <div 
                              className={cn(
                                "overflow-hidden transition-all duration-300",
                                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                              )}
                            >
                              <div className="px-5 pb-5 pt-0">
                                <p className="text-stripe-text leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}


