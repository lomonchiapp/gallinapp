import { useNavigate } from "react-router-dom"
import { Section } from "@/components/layout/Section"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function Hero() {
  const navigate = useNavigate()

  return (
    <Section background="canvas" padding="none" className=" pb-12 md:pb-2 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6 relative z-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-bold uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
              Nueva Versión 2.0
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark leading-[1.1] tracking-tight">
              Gestión Avícola <br />
              <span className="text-brand-primary">Inteligente.</span>
            </h1>

            <p className="text-lg md:text-xl text-stripe-text max-w-xl leading-relaxed">
              La plataforma SaaS más potente para controlar tus lotes, finanzas y 
              producción. Diseñada para productores que buscan la excelencia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth/signup')}
                className="h-14 px-8 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full text-base font-bold shadow-premium hover:shadow-floating transition-all"
              >
                Prueba 14 días gratis
              </Button>
              <button className="flex items-center gap-2 font-bold text-brand-dark hover:opacity-70 transition-opacity">
                Ver demo en vivo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-stripe-muted">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-sm font-medium">
                <span className="text-brand-dark font-bold">+10,000</span> productores ya gestionan su granja
              </p>
            </div>
          </div>

          {/* Right Visual (Phone) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end h-[600px] md:h-[850px] items-center">
            <div className="relative z-10 animate-float flex justify-center items-center w-full">
              {/* Demo Image - Large and Clean */}
              <img 
                src="/images/fronthero.avif" 
                alt="Gallinapp App Demo" 
                className="max-w-[500px] md:max-w-[650px] lg:max-w-[950px] drop-shadow-[0_35px_60px_rgba(0,0,0,0.3)]"
              />
              
              {/* Floating Element 1 */}
              <div className="absolute -left-4 md:-left-16 top-1/4 glass p-3 md:p-5 rounded-2xl shadow-floating animate-bounce-slow z-20">
                <div className="text-[10px] md:text-xs font-bold text-stripe-muted mb-1 uppercase tracking-wider">Producción</div>
                <div className="text-lg md:text-2xl font-black text-brand-primary">+12.5%</div>
              </div>

              {/* Floating Element 2 */}
              <div className="absolute -right-4 md:-right-12 bottom-1/4 glass p-3 md:p-5 rounded-2xl shadow-floating z-20">
                <div className="text-[10px] md:text-xs font-bold text-stripe-muted mb-1 uppercase tracking-wider">Mortalidad</div>
                <div className="text-lg md:text-2xl font-black text-red-500">-3.2%</div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-brand-primary/15 rounded-full blur-[120px]" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
