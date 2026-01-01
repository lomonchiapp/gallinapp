import { Button } from "@/components/ui/button"
import { Smartphone, Download, Star } from "lucide-react"

export function HeroContent() {
  return (
    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
      <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-xs md:text-sm text-white font-medium shadow-xl">
        <Smartphone className="mr-2 h-4 w-4" />
        La app #1 para el sector avícola
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
        Tu granja en <br />
        <span className="text-yellow-400">tiempo real</span>
      </h1>
      
      <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
        Control total de ponedoras, engorde y levante. 
        Precisión técnica y financiera en la palma de tu mano.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
        <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 px-10 py-7 text-lg rounded-2xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
          Empieza Gratis
        </Button>
        <div className="flex items-center gap-3 px-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-primary-200 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
              </div>
            ))}
          </div>
          <div className="text-white text-sm">
            <span className="font-bold">+10k</span> productores ya confían
          </div>
        </div>
      </div>
    </div>
  )
}









