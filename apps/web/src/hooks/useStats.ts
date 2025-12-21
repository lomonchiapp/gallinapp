import { useMemo } from "react"
import type { Stat } from "@/types/benefit"

interface UseStatsOptions {
  stats: Stat[]
  limit?: number
}

export function useStats({ stats, limit }: UseStatsOptions) {
  const limitedStats = useMemo(() => {
    if (limit && limit > 0) {
      return stats.slice(0, limit)
    }
    return stats
  }, [stats, limit])

  return {
    stats: limitedStats,
    total: stats.length,
  }
}








