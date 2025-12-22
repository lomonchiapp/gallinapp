import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import type { SecondaryFeature } from "@/types/feature"

interface SecondaryFeatureCardProps {
  feature: SecondaryFeature
}

export function SecondaryFeatureCard({ feature }: SecondaryFeatureCardProps) {
  const Icon = feature.icon

  return (
    <div className="group relative p-10 md:p-12 rounded-2xl bg-white border-2 border-neutral-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="space-y-6">
        {/* Icon */}
        <div
          className="inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300"
          style={{ backgroundColor: feature.color }}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>

        {/* Title and Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-xl font-bold leading-tight" style={{ color: "#35354C" }}>
            {feature.title}
          </h3>
          <Badge
            variant="outline"
            className="text-xs font-semibold border-2 px-3 py-1"
            style={{ borderColor: feature.color, color: feature.color }}
          >
            {feature.badge}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-base text-neutral-600 leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Decorative element */}
      <div
        className="absolute top-4 right-4 h-20 w-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: feature.color }}
      ></div>
    </div>
  )
}









