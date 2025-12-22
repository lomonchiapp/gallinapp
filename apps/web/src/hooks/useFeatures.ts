import { mainFeatures, secondaryFeatures, highlights } from "@/data/features"
import type { MainFeature, SecondaryFeature, Highlight } from "@/types/feature"

export function useFeatures() {
  return {
    mainFeatures,
    secondaryFeatures,
    highlights,
  }
}

export type { MainFeature, SecondaryFeature, Highlight }









