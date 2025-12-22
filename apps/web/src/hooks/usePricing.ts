import { plans } from "@/data/pricing"
import type { Plan } from "@/types/pricing"

export function usePricing() {
  return {
    plans,
  }
}

export type { Plan }









