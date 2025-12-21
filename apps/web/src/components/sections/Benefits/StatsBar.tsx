import { StatCard } from "@/components/features/StatCard/StatCard"
import type { Stat } from "@/types/benefit"

interface StatsBarProps {
  stats: Stat[]
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex justify-center items-center w-full mb-12 md:mb-16 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full">
        {stats.map((stat, index) => (
          <StatCard key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  )
}








