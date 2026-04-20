/**
 * Tipos centralizados para suscripciones
 * Single Source of Truth para datos de suscripción
 * 
 * PRECIOS OFICIALES (USD):
 * - FREE: $0 (solo colaborador)
 * - BASIC: $39.99/mes, $99.99/trimestre, $199.99/año
 * - PRO: $49.99/mes, $124.99/trimestre, $249.99/año
 * - HACIENDA: $99.99/mes, $249.99/trimestre, $499.99/año
 */

export const enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  HACIENDA = 'hacienda' // Antes "enterprise", ahora "Estate Plus" en inglés
}

export const enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing'
}

export interface SubscriptionLimits {
  maxFarms: number;
  maxLotesPerType: number; // Lotes por tipo (ponedoras, engorde, levante)
  maxCollaborators: number;
  maxStorage: number; // GB
  features: {
    // Módulos básicos (todos los planes de pago)
    mortalityRecords: boolean;
    productionRecords: boolean;
    productionCalculations: boolean;
    costCalculations: boolean;
    sheds: boolean; // Galpones
    expensesModule: boolean;
    // Módulos PRO+
    inventoryModule: boolean;
    salesModule: boolean;
    electronicInvoicing: boolean;
    // Extras
    exports: boolean;
    apiAccess: boolean;
    customReports: boolean;
    prioritySupport: boolean;
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
    maxFarms: 0, // Solo puede colaborar, no crear granjas
    maxLotesPerType: 0,
    maxCollaborators: 0, // No es owner de nada
    maxStorage: 0,
    features: {
      mortalityRecords: true, // Puede registrar como colaborador
      productionRecords: true,
      productionCalculations: false,
      costCalculations: false,
      sheds: false,
      expensesModule: false,
      inventoryModule: false,
      salesModule: false,
      electronicInvoicing: false,
      exports: false,
      apiAccess: false,
      customReports: false,
      prioritySupport: false,
    }
  },
  [SubscriptionPlan.BASIC]: {
    maxFarms: 1,
    maxLotesPerType: 5, // 5 lotes de ponedoras, 5 de engorde, 5 de levante
    maxCollaborators: 2,
    maxStorage: 2, // 2GB
    features: {
      mortalityRecords: true,
      productionRecords: true,
      productionCalculations: true,
      costCalculations: true,
      sheds: true,
      expensesModule: true,
      inventoryModule: false,
      salesModule: false,
      electronicInvoicing: false,
      exports: true,
      apiAccess: false,
      customReports: false,
      prioritySupport: false,
    }
  },
  [SubscriptionPlan.PRO]: {
    maxFarms: 3,
    maxLotesPerType: 20,
    maxCollaborators: 10,
    maxStorage: 10, // 10GB
    features: {
      mortalityRecords: true,
      productionRecords: true,
      productionCalculations: true,
      costCalculations: true,
      sheds: true,
      expensesModule: true,
      inventoryModule: true,
      salesModule: true,
      electronicInvoicing: true,
      exports: true,
      apiAccess: true,
      customReports: true,
      prioritySupport: true,
    }
  },
  [SubscriptionPlan.HACIENDA]: {
    maxFarms: 10,
    maxLotesPerType: -1, // Ilimitado
    maxCollaborators: 50,
    maxStorage: 50, // 50GB
    features: {
      mortalityRecords: true,
      productionRecords: true,
      productionCalculations: true,
      costCalculations: true,
      sheds: true,
      expensesModule: true,
      inventoryModule: true,
      salesModule: true,
      electronicInvoicing: true,
      exports: true,
      apiAccess: true,
      customReports: true,
      prioritySupport: true,
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
  name: string;
  nameEn: string; // Nombre en inglés
  description: string;
  features: string[];
  popular?: boolean;
  monthly: PlanPricingPeriod;
  quarterly: PlanPricingPeriod;
  annual: PlanPricingPeriod;
}

// Info del plan FREE (no tiene precios, solo info visual)
export const FREE_PLAN_INFO = {
  name: 'Colaborador',
  nameEn: 'Collaborator',
  description: 'Acceso como colaborador a granjas.',
  features: [
    'Unirse a granjas existentes',
    'Registrar mortalidad',
    'Registrar producción',
    'Ver datos de la granja',
  ],
};

// Precios por plan - Single Source of Truth
// NOTA: Estos precios DEBEN coincidir con los configurados en RevenueCat/App Store/Play Store
export const SUBSCRIPTION_PRICING: Record<Exclude<SubscriptionPlan, SubscriptionPlan.FREE>, PlanPricing> = {
  [SubscriptionPlan.BASIC]: {
    name: 'Básico',
    nameEn: 'Basic',
    description: "Tu primera granja digital.",
    features: [
      "1 granja",
      "2 colaboradores",
      "5 lotes por tipo",
      "Registros de mortalidad",
      "Registros de producción",
      "Cálculos de producción",
      "Cálculos de costos",
      "Galpones",
      "Módulo de gastos",
    ],
    monthly: {
      price: 39.99,
      stripePriceId: 'price_basic_monthly',
      revenueCatId: 'basico_mensual',
    },
    quarterly: {
      price: 99.99,
      stripePriceId: 'price_basic_quarterly',
      revenueCatId: 'basico_trimestral',
      savingsLabel: 'Ahorra 17%',
    },
    annual: {
      price: 199.99,
      stripePriceId: 'price_basic_annual',
      revenueCatId: 'basico_anual',
      savingsLabel: 'Ahorra 58%',
    },
  },
  [SubscriptionPlan.PRO]: {
    name: 'Gallinapp Pro',
    nameEn: 'Gallinapp Pro',
    description: "Para granjas en crecimiento.",
    features: [
      "Todo lo del plan Básico",
      "3 granjas",
      "10 colaboradores",
      "20 lotes por tipo",
      "Módulo de inventario",
      "Módulo de ventas",
      "Facturación electrónica",
      "Acceso API",
      "Soporte prioritario",
    ],
    popular: true,
    monthly: {
      price: 49.99,
      stripePriceId: 'price_pro_monthly',
      revenueCatId: 'pro_mensual',
    },
    quarterly: {
      price: 124.99,
      stripePriceId: 'price_pro_quarterly',
      revenueCatId: 'pro_trimestral',
      savingsLabel: 'Ahorra 17%',
    },
    annual: {
      price: 249.99,
      stripePriceId: 'price_pro_annual',
      revenueCatId: 'pro_anual',
      savingsLabel: 'Ahorra 58%',
    },
  },
  [SubscriptionPlan.HACIENDA]: {
    name: 'Hacienda',
    nameEn: 'Estate Plus',
    description: "Para operaciones grandes.",
    features: [
      "Todo lo del plan Pro",
      "10 granjas",
      "50 colaboradores",
      "Lotes ilimitados",
      "Almacenamiento 50GB",
      "Reportes personalizados",
      "Soporte dedicado",
    ],
    monthly: {
      price: 99.99,
      stripePriceId: 'price_hacienda_monthly',
      revenueCatId: 'hacienda_mensual',
    },
    quarterly: {
      price: 249.99,
      stripePriceId: 'price_hacienda_quarterly',
      revenueCatId: 'hacienda_trimestral',
      savingsLabel: 'Ahorra 17%',
    },
    annual: {
      price: 499.99,
      stripePriceId: 'price_hacienda_annual',
      revenueCatId: 'hacienda_anual',
      savingsLabel: 'Ahorra 58%',
    },
  },
};

