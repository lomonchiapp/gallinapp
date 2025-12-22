import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"
import type { MainFeature } from "@/types/feature"

interface FeatureCardProps {
  feature: MainFeature
  className?: string
}

export function FeatureCard({ feature, className }: FeatureCardProps) {
  const Icon = feature.icon

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white border-2 border-neutral-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 p-10 md:p-12",
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${feature.bgColor}05 0%, ${feature.bgColor}15 100%)`,
        }}
      ></div>

      <div className="relative z-10 space-y-6">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between mb-10">
          <div
            className="relative h-20 w-20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
            style={{ backgroundColor: feature.bgColor }}
          >
            <Icon className="h-10 w-10 text-white" />
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <Badge
            className="px-4 py-2 font-bold border-0 shadow-md text-sm"
            style={{ backgroundColor: "#E8EBF5", color: "#345DAD" }}
          >
            {feature.badge}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-5">
          <h3
            className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-opacity-90 transition-colors"
            style={{ color: "#35354C" }}
          >
            {feature.title}
          </h3>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 pt-8 mt-8 border-t-2 border-neutral-100">
          {feature.stats.map((stat, idx) => (
            <div key={idx} className="flex-1 space-y-2">
              <div
                className="text-3xl md:text-4xl font-bold"
                style={{ color: feature.bgColor }}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Hover Arrow */}
        <div
          className="mt-8 flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: feature.bgColor }}
        >
          <span>Explorar más</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  )
}









