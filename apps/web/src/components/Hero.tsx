import { Button } from "@/components/ui/button"
import { Download, Smartphone, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40" style={{ backgroundColor: '#345DAD' }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary-300/20"></div>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-2 text-sm text-white font-medium shadow-lg">
              <Smartphone className="mr-2 h-4 w-4" />
              Disponible en iOS y Android
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Gestión Avícola{" "}
              <span className="text-yellow-300">Profesional</span>{" "}
              en tu Bolsillo
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Controla tus lotes de gallinas ponedoras, pollos de engorde y levante con tecnología de punta. 
              Aumenta tu productividad y rentabilidad desde cualquier lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="group text-base px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                <Download className="mr-2 h-5 w-5" />
                Descargar para iOS
              </Button>
              <Button size="lg" variant="outline" className="group text-base px-8 py-6 h-auto border-2 hover:bg-primary-50 transition-all">
                <Download className="mr-2 h-5 w-5" />
                Descargar para Android
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                  ))}
                </div>
                <div className="ml-2">
                  <div className="text-2xl font-bold text-white">4.8/5</div>
                  <div className="text-sm text-white/80">Valoración promedio</div>
                </div>
              </div>
              <div className="h-16 w-px bg-white/30" />
              <div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/80">Usuarios activos</div>
              </div>
            </div>
          </div>
          <div className="relative lg:block hidden">
            <div className="relative mx-auto max-w-sm">
              <div className="aspect-[9/19] w-full rounded-[3rem] border-8 border-neutral-900 bg-neutral-800 p-2 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="h-full w-full rounded-[2.5rem] bg-white overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center p-8">
                    <img 
                      src="/images/full-logo-white.png" 
                      alt="Gallinapp" 
                      className="w-48 mb-6"
                    />
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🐓</div>
                      <div className="text-lg font-semibold opacity-90">Gestión Avícola Profesional</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

