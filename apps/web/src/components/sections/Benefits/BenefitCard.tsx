import { Sparkles, ArrowRight } from "lucide-react"
import type { Benefit } from "@/types/benefit"

interface BenefitCardProps {
  benefit: Benefit
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const Icon = benefit.icon

  return (
    <div className="group relative flex w-full">
      {/* Card */}
      <div className="h-full w-full bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/20 flex flex-col">
        {/* Icon with gradient */}
        <div className="relative mb-4 md:mb-6 flex justify-center md:justify-start w-full">
          <div
            className={`h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br ${benefit.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
          >
            <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg md:text-xl font-bold text-secondary-500 mb-2 md:mb-3 group-hover:text-primary-600 transition-colors text-center md:text-left w-full">
          {benefit.title}
        </h3>
        <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-4 md:mb-6 text-center md:text-left flex-grow w-full">
          {benefit.description}
        </p>

        {/* Metric */}
        <div className="pt-4 md:pt-6 border-t border-neutral-100 mt-auto w-full">
          <div className="flex items-center justify-between w-full">
            <div className="text-center md:text-left flex-1">
              <div className="text-xl md:text-2xl font-bold text-primary-600">
                {benefit.metric}
              </div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                {benefit.metricLabel}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-500 transition-colors flex-shrink-0 ml-2">
              <ArrowRight className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








