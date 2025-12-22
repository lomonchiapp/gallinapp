import { Button } from "@/components/ui/button"
import { Download, Smartphone, Star } from "lucide-react"
import { DownloadButton } from "@/components/shared/DownloadButton"

export function HeroContent() {
  return (
    <div className="space-y-8">
      <div className="inline-flex items-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-2 text-sm text-white font-medium shadow-lg">
        <Smartphone className="mr-2 h-4 w-4" />
        Disponible en iOS y Android
      </div>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
        Gestión Avícola{" "}
        <span className="text-yellow-300">Profesional</span> en tu Bolsillo
      </h1>
      <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
        Controla tus lotes de gallinas ponedoras, pollos de engorde y levante
        con tecnología de punta. Aumenta tu productividad y rentabilidad desde
        cualquier lugar.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button size="lg" className="group text-base px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
          <Download className="mr-2 h-5 w-5" />
          Descargar para iOS
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="group text-base px-8 py-6 h-auto border-2 hover:bg-primary-50 transition-all"
        >
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
  )
}









