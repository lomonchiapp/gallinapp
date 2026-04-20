/**
 * Tipos de suscripción para el Admin Panel
 * Alineados con packages/types/subscription.ts
 */

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'HACIENDA'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing'
export type SubscriptionPeriod = 'monthly' | 'quarterly' | 'annual'

export interface SubscriptionInfo {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  period?: SubscriptionPeriod
  startDate?: Date
  endDate?: Date
  trialEndsAt?: Date
  cancelAtPeriodEnd?: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  revenueCatId?: string
}

export interface SubscriptionStats {
  free: number
  basic: number
  pro: number
  hacienda: number
  total: number
  active: number
  trialing: number
  cancelled: number
  pastDue: number
}

// Precios mensuales para cálculos de MRR
export const PLAN_PRICES: Record<Exclude<SubscriptionPlan, 'FREE'>, { monthly: number; quarterly: number; annual: number }> = {
  BASIC: { monthly: 39.99, quarterly: 99.99, annual: 199.99 },
  PRO: { monthly: 49.99, quarterly: 124.99, annual: 249.99 },
  HACIENDA: { monthly: 99.99, quarterly: 249.99, annual: 499.99 },
}

// MRR equivalente por plan (usando precio mensual como base)
export const PLAN_MRR: Record<SubscriptionPlan, number> = {
  FREE: 0,
  BASIC: 39.99,
  PRO: 49.99,
  HACIENDA: 99.99,
}

export const PLAN_COLORS: Record<SubscriptionPlan, { bg: string; text: string; border: string }> = {
  FREE: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  BASIC: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  PRO: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  HACIENDA: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
}

export const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
  past_due: 'bg-yellow-100 text-yellow-700',
  trialing: 'bg-blue-100 text-blue-700',
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  FREE: 'Colaborador',
  BASIC: 'Básico',
  PRO: 'Gallinapp Pro',
  HACIENDA: 'Hacienda',
}


