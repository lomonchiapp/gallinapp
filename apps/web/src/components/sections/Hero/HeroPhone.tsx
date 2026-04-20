import { TrendingUp, TrendingDown, Bell, Egg } from "lucide-react"

export function HeroPhone() {
  return (
    <div className="relative lg:block hidden">
      {/* Floating Stats Cards */}
      <div className="absolute -left-16 top-16 z-20 animate-bounce-slow">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Producción</div>
            <div className="text-xl font-black text-green-600">+12.5%</div>
          </div>
        </div>
      </div>

      <div className="absolute -right-12 top-1/3 z-20" style={{ animationDelay: '0.5s' }}>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center gap-3 animate-pulse-slow">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <TrendingDown className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Mortalidad</div>
            <div className="text-xl font-black text-red-600">-3.2%</div>
          </div>
        </div>
      </div>

      <div className="absolute -left-8 bottom-1/4 z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-white/50 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Bell className="text-white w-4 h-4" />
          </div>
          <div className="pr-2">
            <div className="text-[10px] text-neutral-500 font-medium">Nueva alerta</div>
            <div className="text-xs font-bold text-neutral-800">Recolección Galpón 3</div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 bottom-24 z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Egg className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wide">Inventario</div>
            <div className="text-xl font-black text-blue-600">2,450</div>
          </div>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="relative mx-auto max-w-[320px] z-10">
        <div className="aspect-[9/19] w-full rounded-[3rem] border-[14px] border-neutral-900 bg-neutral-900 p-1.5 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-0 transition-all duration-700 ease-out">
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-neutral-900 rounded-b-3xl z-20" />
          
          {/* Screen Content */}
          <div className="h-full w-full rounded-[2.5rem] bg-white overflow-hidden relative">
            {/* App Screen */}
            <div className="h-full w-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex flex-col">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-6 py-3 text-white/80 text-xs font-medium">
                <span>9:41</span>
                <div className="flex gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 4h-3V2h-4v2H7v18h10V4z"/>
                  </svg>
                </div>
              </div>
              
              {/* App Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <img
                  src="/images/full-logo-white.png"
                  alt="Gallinapp"
                  className="w-36 mb-8 drop-shadow-lg"
                />
                
                {/* Loading Animation */}
                <div className="w-full max-w-[160px] h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
                  <div className="h-full w-2/3 bg-white/80 rounded-full animate-pulse" />
                </div>
                
                <div className="text-white/60 text-xs font-medium tracking-wider uppercase">
                  Sincronizando datos...
                </div>
                
                {/* Quick Stats Preview */}
                <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-[200px]">
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-white/60 text-[10px] mb-1">Lotes</div>
                    <div className="text-white font-bold">12</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-white/60 text-[10px] mb-1">Aves</div>
                    <div className="text-white font-bold">8.5K</div>
                  </div>
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="flex justify-center pb-3">
                <div className="w-32 h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-primary-400/30 via-primary-500/10 to-transparent rounded-full" />
    </div>
  )
}
