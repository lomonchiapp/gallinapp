import { Card, CardContent } from "@/components/ui/card"
import { Smartphone } from "lucide-react"

const screenshots = [
  {
    title: "Dashboard",
    image: "📊",
    color: "bg-primary-500"
  },
  {
    title: "Lotes",
    image: "🐓",
    color: "bg-success-500"
  },
  {
    title: "Finanzas",
    image: "💰",
    color: "bg-info-500"
  },
  {
    title: "Alertas",
    image: "🔔",
    color: "bg-warning-500"
  }
]

export function Gallery() {
  return (
    <section id="galeria" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-secondary-500 mb-4">
              Diseño <span className="text-primary-500">Intuitivo</span>
            </h2>
            <p className="text-lg text-neutral-500 max-w-xl">
              Creado para que te enfoques en lo que importa: tus resultados.
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="min-w-[260px] md:min-w-[300px] snap-center">
              <div className={`aspect-[9/19] ${screenshot.color} rounded-[3rem] p-3 shadow-2xl relative group overflow-hidden`}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                <div className="h-full w-full rounded-[2.5rem] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-125 transition-transform duration-500">{screenshot.image}</span>
                </div>
                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <span className="text-white font-bold tracking-widest text-sm uppercase opacity-60">{screenshot.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

