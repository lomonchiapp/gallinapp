/**
 * Tipos centralizados para suscripciones
 * Single Source of Truth para datos de suscripción
 */

export const enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export const enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing'
}

export interface SubscriptionLimits {
  maxLotes: number;
  maxCollaborators: number;
  maxStorage: number; // GB
  maxTransactions: number; // por mes
  features: {
    analytics: boolean;
    exports: boolean;
    apiAccess: boolean;
    customReports: boolean;
    multiLocation: boolean;
    integrations: boolean;
    advancedAlerts: boolean;
  };
}

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  limits: SubscriptionLimits;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEndsAt?: Date;
}

// Límites por plan - Single Source of Truth
export const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> = {
  [SubscriptionPlan.FREE]: {
    maxLotes: 0, // Solo colaborador
    maxCollaborators: 1, // El owner
    maxStorage: 0.1, // 100MB
    maxTransactions: 0,
    features: {
      analytics: false,
      exports: false,
      apiAccess: false,
      customReports: false,
      multiLocation: false,
      integrations: false,
      advancedAlerts: false,
    }
  },
  [SubscriptionPlan.BASIC]: {
    maxLotes: 10,
    maxCollaborators: 3,
    maxStorage: 5, // 5GB
    maxTransactions: 500,
    features: {
      analytics: true,
      exports: true,
      apiAccess: false,
      customReports: false,
      multiLocation: false,
      integrations: false,
      advancedAlerts: true,
    }
  },
  [SubscriptionPlan.PRO]: {
    maxLotes: 50,
    maxCollaborators: 10,
    maxStorage: 25, // 25GB
    maxTransactions: 2000,
    features: {
      analytics: true,
      exports: true,
      apiAccess: true,
      customReports: true,
      multiLocation: true,
      integrations: false,
      advancedAlerts: true,
    }
  },
  [SubscriptionPlan.ENTERPRISE]: {
    maxLotes: -1, // Unlimited
    maxCollaborators: -1, // Unlimited
    maxStorage: -1, // Unlimited
    maxTransactions: -1, // Unlimited
    features: {
      analytics: true,
      exports: true,
      apiAccess: true,
      customReports: true,
      multiLocation: true,
      integrations: true,
      advancedAlerts: true,
    }
  }
};

export interface PlanPricingPeriod {
  price: number;
  stripePriceId: string;
  revenueCatId: string;
  savingsLabel?: string;
}

export interface PlanPricing {
  description: string;
  features: string[];
  popular?: boolean;
  monthly: PlanPricingPeriod;
  quarterly: PlanPricingPeriod;
  annual: PlanPricingPeriod;
}

// Precios por plan - Single Source of Truth
export const SUBSCRIPTION_PRICING: Record<Exclude<SubscriptionPlan, SubscriptionPlan.FREE>, PlanPricing> = {
  [SubscriptionPlan.BASIC]: {
    description: "Para productores que están empezando.",
    features: ["Hasta 10 lotes", "3 colaboradores", "5 GB almacenamiento", "500 transacciones/mes", "Alertas avanzadas"],
    monthly: {
      price: 19.99,
      stripePriceId: 'price_basic_monthly',
      revenueCatId: 'basic_monthly',
    },
    quarterly: {
      price: 54.99,
      stripePriceId: 'price_basic_quarterly',
      revenueCatId: 'basic_trimestral',
      savingsLabel: 'Ahorra 8%',
    },
    annual: {
      price: 199.99,
      stripePriceId: 'price_basic_annual',
      revenueCatId: 'basic_annual',
      savingsLabel: 'Ahorra 17%',
    },
  },
  [SubscriptionPlan.PRO]: {
    description: "Para granjas comerciales en crecimiento.",
    features: ["Hasta 50 lotes", "10 colaboradores", "25 GB almacenamiento", "Facturación y Ventas Pro", "Acceso API", "Reportes personalizados"],
    popular: true,
    monthly: {
      price: 49.99,
      stripePriceId: 'price_pro_monthly',
      revenueCatId: 'pro_monthly',
    },
    quarterly: {
      price: 134.99,
      stripePriceId: 'price_pro_quarterly',
      revenueCatId: 'pro_trimestral',
      savingsLabel: 'Ahorra 10%',
    },
    annual: {
      price: 499.99,
      stripePriceId: 'price_pro_annual',
      revenueCatId: 'pro_annual',
      savingsLabel: 'Ahorra 17%',
    },
  },
  [SubscriptionPlan.ENTERPRISE]: {
    description: "Para grandes operaciones y cooperativas.",
    features: ["Lotes ilimitados", "Colaboradores ilimitados", "Almacenamiento ilimitado", "Transacciones ilimitadas", "Soporte prioritario 24/7", "Gerente de cuenta dedicado"],
    monthly: {
      price: 99.99,
      stripePriceId: 'price_enterprise_monthly',
      revenueCatId: 'enterprise_monthly',
    },
    quarterly: {
      price: 269.99,
      stripePriceId: 'price_enterprise_quarterly',
      revenueCatId: 'enterprise_trimestral',
      savingsLabel: 'Ahorra 10%',
    },
    annual: {
      price: 999.99,
      stripePriceId: 'price_enterprise_annual',
      revenueCatId: 'enterprise_annual',
      savingsLabel: 'Ahorra 17%',
    },
  },
};

// Suscripción por defecto para nuevas cuentas
export const DEFAULT_SUBSCRIPTION: Subscription = {
  plan: SubscriptionPlan.FREE,
  status: SubscriptionStatus.TRIALING,
  startDate: new Date(),
  limits: SUBSCRIPTION_LIMITS[SubscriptionPlan.FREE],
  trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días gratis
};




