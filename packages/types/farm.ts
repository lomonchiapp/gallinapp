/**
 * Tipos para el sistema de Granjas (Farm)
 * La granja solo contiene datos de la granja, NO datos de suscripción
 */

// === TIPOS DE SOPORTE ===

export type CountryCode = 'DO' | 'MX' | 'CO' | 'AR' | 'BR' | 'US';
export type CurrencyCode = 'DOP' | 'MXN' | 'COP' | 'ARS' | 'BRL' | 'USD' | 'EUR';
export type TaxIdType = 'RNC' | 'CEDULA' | 'RFC' | 'NIT' | 'CUIT' | 'CNPJ' | 'CPF' | 'EIN';
export type RegimenFiscal = 
  | 'RD_REGIMEN_SIMPLIFICADO' | 'RD_REGIMEN_ORDINARIO'
  | 'MX_PERSONA_FISICA' | 'MX_PERSONA_MORAL' | 'MX_RESICO'
  | 'CO_REGIMEN_SIMPLE' | 'CO_RESPONSABLE_IVA' | 'CO_NO_RESPONSABLE_IVA'
  | 'AR_RESPONSABLE_INSCRIPTO' | 'AR_MONOTRIBUTO' | 'AR_EXENTO'
  | 'BR_SIMPLES_NACIONAL' | 'BR_LUCRO_PRESUMIDO' | 'BR_LUCRO_REAL';

export interface FiscalAddress {
  street: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: CountryCode;
}

export interface FarmFiscalConfig {
  // Identificación fiscal
  taxId?: string;
  taxIdType?: TaxIdType;
  razonSocial?: string;
  nombreComercial?: string;
  direccionFiscal?: FiscalAddress;
  
  // Configuración de impuestos
  taxRate: number; // Ej: 0.18 = 18%
  taxName: string; // ITBIS, IVA, ICMS, etc.
  taxIncluded: boolean; // Si los precios incluyen impuesto
  
  // Régimen fiscal
  regimenFiscal?: RegimenFiscal;
  
  // Configuración específica por país
  // Rep. Dominicana
  ncfType?: string; // B01, B02, etc.
  ncfSeries?: string;
  ncfSecuencia?: number;
  
  // México
  cfdiUse?: string;
  lugarExpedicion?: string;
  
  // Colombia
  resolucionDian?: string;
  prefijoFactura?: string;
  rangoInicio?: number;
  rangoFin?: number;
  
  // Argentina
  puntoVenta?: number;
  condicionIVA?: string;
  
  // Brasil
  ambiente?: 'PRODUCAO' | 'HOMOLOGACAO';
  serie?: number;
  inscricaoEstadual?: string;
}

export interface FarmRegionalConfig {
  countryCode: CountryCode;
  currency: CurrencyCode;
  locale: string; // es-DO, es-MX, pt-BR, etc.
  timezone: string;
  language: 'es' | 'pt' | 'en';
  fiscal: FarmFiscalConfig;
}

// === INTERFAZ PRINCIPAL ===

export interface Farm {
  id: string;
  name: string; // Nombre principal de la granja
  displayName?: string; // Nombre para mostrar (opcional)
  description?: string;
  farmCode: string; // Código único de 8 caracteres para acceso
  
  // Información de la granja
  farmInfo: {
    location?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    establishedDate?: Date;
    totalArea?: number; // Hectáreas
    capacity?: number; // Capacidad total de aves
  };
  
  // Configuración regional y fiscal (nueva)
  regional: FarmRegionalConfig;
  
  // Configuración específica de la granja
  // Todas las configuraciones operativas y de negocio de la granja
  settings: {
    // Precios específicos de esta granja
    defaultEggPrice: number; // Precio por unidad de huevo (DOP)
    defaultChickenPricePerPound: number; // Precio por libra de pollo de engorde (DOP)
    defaultLevantePricePerUnit: number; // Precio por unidad de pollo israelí (DOP)
    
    // Configuraciones de crecimiento y operativas
    israeliGrowthDays: number; // Días promedio de crecimiento para israelíes
    engordeGrowthDays: number; // Días promedio de crecimiento para engorde
    targetEngordeWeight: number; // Peso objetivo en libras para pollos de engorde
    acceptableMortalityRate: number; // Porcentaje de mortalidad aceptable
    eggsPerBox: number; // Cantidad estándar de huevos por caja para ventas
    
    // Configuración de facturación específica de la granja
    invoiceSettings: {
      prefix: string;
      nextNumber: number;
      format: string;
      taxRate?: number;
      currency: string;
    };
    
    // Configuración de notificaciones específica de la granja
    notifications: {
      alertsEnabled: boolean;
      emailNotifications: boolean;
      smsNotifications: boolean;
      pushNotifications: boolean;
      mostrarAlertasExito: boolean;
      mostrarAlertasError: boolean;
      mostrarAlertasConfirmacion: boolean;
      sonidoAlertas: boolean;
      vibrarEnAlertas: boolean;
    };
    
    // Configuración regional específica de la granja
    timezone: string;
    language: string;
  };
  
  // Propietario y metadatos
  ownerId: string; // UID del usuario que creó la granja
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Configuración por defecto para nuevas granjas
export const DEFAULT_FARM_SETTINGS = {
  // Precios por defecto
  defaultEggPrice: 8.0, // DOP por unidad
  defaultChickenPricePerPound: 65.0, // DOP por libra
  defaultLevantePricePerUnit: 150.0, // DOP por ave
  
  // Configuraciones de crecimiento y operativas
  israeliGrowthDays: 45, // días
  engordeGrowthDays: 42, // días
  targetEngordeWeight: 4.5, // libras
  acceptableMortalityRate: 5.0, // porcentaje
  eggsPerBox: 30, // Cantidad estándar de huevos por caja
  
  invoiceSettings: {
    prefix: 'FAC',
    nextNumber: 1,
    format: 'FAC-{number}',
    taxRate: 0.18, // 18% ITBIS en República Dominicana
    currency: 'DOP',
  },
  
  notifications: {
    alertsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    mostrarAlertasExito: true,
    mostrarAlertasError: true,
    mostrarAlertasConfirmacion: true,
    sonidoAlertas: true,
    vibrarEnAlertas: true,
  },
  
  timezone: 'America/Santo_Domingo',
  language: 'es',
};

// Configuración regional por defecto (República Dominicana)
export const DEFAULT_REGIONAL_CONFIG: FarmRegionalConfig = {
  countryCode: 'DO',
  currency: 'DOP',
  locale: 'es-DO',
  timezone: 'America/Santo_Domingo',
  language: 'es',
  fiscal: {
    taxRate: 0.18,
    taxName: 'ITBIS',
    taxIncluded: false,
    ncfType: 'B02',
  },
};

// Configuraciones regionales por país
export const REGIONAL_CONFIGS: Record<CountryCode, Partial<FarmRegionalConfig>> = {
  DO: {
    countryCode: 'DO',
    currency: 'DOP',
    locale: 'es-DO',
    timezone: 'America/Santo_Domingo',
    language: 'es',
    fiscal: {
      taxRate: 0.18,
      taxName: 'ITBIS',
      taxIncluded: false,
      ncfType: 'B02',
    },
  },
  MX: {
    countryCode: 'MX',
    currency: 'MXN',
    locale: 'es-MX',
    timezone: 'America/Mexico_City',
    language: 'es',
    fiscal: {
      taxRate: 0.16,
      taxName: 'IVA',
      taxIncluded: false,
    },
  },
  CO: {
    countryCode: 'CO',
    currency: 'COP',
    locale: 'es-CO',
    timezone: 'America/Bogota',
    language: 'es',
    fiscal: {
      taxRate: 0.19,
      taxName: 'IVA',
      taxIncluded: false,
    },
  },
  AR: {
    countryCode: 'AR',
    currency: 'ARS',
    locale: 'es-AR',
    timezone: 'America/Argentina/Buenos_Aires',
    language: 'es',
    fiscal: {
      taxRate: 0.21,
      taxName: 'IVA',
      taxIncluded: false,
    },
  },
  BR: {
    countryCode: 'BR',
    currency: 'BRL',
    locale: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    language: 'pt',
    fiscal: {
      taxRate: 0.17,
      taxName: 'ICMS',
      taxIncluded: true, // Brasil típicamente incluye impuesto
      ambiente: 'HOMOLOGACAO',
    },
  },
  US: {
    countryCode: 'US',
    currency: 'USD',
    locale: 'en-US',
    timezone: 'America/New_York',
    language: 'en',
    fiscal: {
      taxRate: 0,
      taxName: 'Tax',
      taxIncluded: false,
    },
  },
};

/**
 * Obtiene la configuración regional por país
 */
export function getRegionalConfigForCountry(countryCode: CountryCode): FarmRegionalConfig {
  const config = REGIONAL_CONFIGS[countryCode];
  if (!config) {
    return DEFAULT_REGIONAL_CONFIG;
  }
  
  return {
    ...DEFAULT_REGIONAL_CONFIG,
    ...config,
    fiscal: {
      ...DEFAULT_REGIONAL_CONFIG.fiscal,
      ...config.fiscal,
    },
  } as FarmRegionalConfig;
}
