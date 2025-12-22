import { benefits, stats } from "@/data/benefits"
import type { Benefit, Stat } from "@/types/benefit"

export function useBenefits() {
  return {
    benefits,
    stats,
  }
}

export type { Benefit, Stat }









