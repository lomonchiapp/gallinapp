import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Smartphone, ChevronRight, Check } from "lucide-react"

export function HeroContent() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 text-center lg:text-left">
      {/* Badge */}
      <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white font-medium shadow-xl">
        <Smartphone className="mr-2 h-4 w-4" />
        La app #1 para el sector avícola
        <span className="ml-2 flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
      </div>
      
      {/* Main Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
        Tu granja,
        <br />
        <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
          bajo control total.
        </span>
      </h1>
      
      {/* Subheadline */}
      <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
        Control profesional de <strong className="text-white">ponedoras</strong>, <strong className="text-white">engorde</strong> y <strong className="text-white">levante</strong>. 
        Precisión técnica y financiera en una sola plataforma.
      </p>
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
        <Button 
          size="lg" 
          onClick={() => navigate('/auth/signup')}
          className="bg-white text-primary-600 hover:bg-primary-50 px-10 py-7 text-lg rounded-2xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 font-bold group"
        >
          Empieza Gratis
          <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button 
          size="lg" 
          variant="ghost"
          onClick={() => navigate('/demo')}
          className="text-white hover:bg-white/10 px-8 py-7 text-lg rounded-2xl font-semibold"
        >
          Ver Demo
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-primary-200 flex items-center justify-center overflow-hidden">
              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="text-white text-sm">
          <span className="font-bold">+10,000</span> productores ya confían en nosotros
        </div>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
        {["Sin tarjeta requerida", "14 días gratis", "Soporte incluido"].map((text, i) => (
          <div 
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/90"
          >
            <Check className="w-4 h-4 text-green-400" />
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
