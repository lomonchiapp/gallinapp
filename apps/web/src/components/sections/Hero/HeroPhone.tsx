import { TrendingUp, Activity, Egg } from "lucide-react"

export function HeroPhone() {
  return (
    <div className="relative lg:block hidden">
      {/* Elementos Flotantes */}
      <div className="absolute -left-12 top-20 z-20 animate-bounce-slow">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-xl">
            <TrendingUp className="text-green-600 w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-medium">Producción</div>
            <div className="text-sm font-bold text-neutral-800">+12% esta semana</div>
          </div>
        </div>
      </div>

      <div className="absolute -right-8 bottom-32 z-20 animate-pulse-slow">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Egg className="text-blue-600 w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-medium">Inventario</div>
            <div className="text-sm font-bold text-neutral-800">2,450 Unidades</div>
          </div>
        </div>
      </div>

      {/* Mockup del Teléfono */}
      <div className="relative mx-auto max-w-[300px] z-10">
        <div className="aspect-[9/19] w-full rounded-[3.5rem] border-[12px] border-neutral-900 bg-neutral-900 p-2 shadow-[0_0_80px_-15px_rgba(0,0,0,0.4)] transform rotate-2 hover:rotate-0 transition-all duration-700">
          <div className="h-full w-full rounded-[2.8rem] bg-white overflow-hidden relative">
            <div className="h-full w-full bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col items-center justify-center p-8">
              <img
                src="/images/full-logo-white.png"
                alt="Gallinapp"
                className="w-40 mb-8"
              />
              <div className="w-16 h-1 bg-white/30 rounded-full mb-8" />
              <Activity className="w-12 h-12 text-white/50 mb-4 animate-pulse" />
              <div className="text-white/40 text-xs font-mono">CONECTANDO...</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decoración de fondo */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary-400/20 rounded-full blur-3xl opacity-50" />
    </div>
  )
}









