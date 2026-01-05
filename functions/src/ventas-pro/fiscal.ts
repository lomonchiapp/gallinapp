/**
 * Cloud Functions para integraciones fiscales
 * Manejo de NCF, CFDI, y otros documentos fiscales por país
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { withRateLimit, RATE_LIMIT_PRESETS } from '../middleware/rateLimit';
import { verifyFarmAccess } from '../middleware/security';

// Inicializar si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ============================================================================
// TIPOS
// ============================================================================

type CountryCode = 'DO' | 'MX' | 'CO' | 'AR' | 'BR' | 'US';

interface NCFConfig {
  tipo: string; // B01, B02, B14, B15, etc.
  serie: string;
  secuenciaActual: number;
  fechaVencimiento: Date;
}

interface FiscalValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface TransmitirDocumentoData {
  farmId: string;
  documentoId: string;
}

// ============================================================================
// VALIDADORES POR PAÍS
// ============================================================================

/**
 * Valida un RNC de República Dominicana
 */
function validarRNC(rnc: string): FiscalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Limpiar RNC
  const rncLimpio = rnc.replace(/\D/g, '');
  
  if (rncLimpio.length !== 9 && rncLimpio.length !== 11) {
    errors.push('El RNC debe tener 9 dígitos (empresas) o 11 dígitos (personas físicas)');
  }
  
  // Validar dígito verificador (algoritmo módulo 11)
  if (rncLimpio.length === 9) {
    const pesos = [7, 9, 8, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 8; i++) {
      suma += parseInt(rncLimpio[i]) * pesos[i];
    }
    const residuo = suma % 11;
    const digitoVerificador = residuo === 0 ? 2 : residuo === 1 ? 1 : 11 - residuo;
    
    if (parseInt(rncLimpio[8]) !== digitoVerificador) {
      errors.push('El dígito verificador del RNC es inválido');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida un RFC de México
 */
function validarRFC(rfc: string): FiscalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const rfcLimpio = rfc.toUpperCase().trim();
  
  // RFC persona física: 13 caracteres, persona moral: 12 caracteres
  if (rfcLimpio.length !== 12 && rfcLimpio.length !== 13) {
    errors.push('El RFC debe tener 12 caracteres (persona moral) o 13 (persona física)');
  }
  
  // Validar formato básico
  const regexMoral = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;
  const regexFisica = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;
  
  if (rfcLimpio.length === 12 && !regexMoral.test(rfcLimpio)) {
    errors.push('Formato de RFC inválido para persona moral');
  }
  
  if (rfcLimpio.length === 13 && !regexFisica.test(rfcLimpio)) {
    errors.push('Formato de RFC inválido para persona física');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida un NIT de Colombia
 */
function validarNIT(nit: string): FiscalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const nitLimpio = nit.replace(/\D/g, '');
  
  if (nitLimpio.length < 9 || nitLimpio.length > 10) {
    errors.push('El NIT debe tener 9 o 10 dígitos');
  }
  
  // Validar dígito de verificación
  if (nitLimpio.length >= 9) {
    const pesos = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3];
    const digitosNit = nitLimpio.slice(0, -1).padStart(15, '0').split('').map(Number);
    let suma = 0;
    for (let i = 0; i < 15; i++) {
      suma += digitosNit[i] * pesos[i];
    }
    const residuo = suma % 11;
    const digitoVerificador = residuo > 1 ? 11 - residuo : residuo;
    
    if (parseInt(nitLimpio[nitLimpio.length - 1]) !== digitoVerificador) {
      warnings.push('El dígito de verificación podría ser incorrecto');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida un CUIT/CUIL de Argentina
 */
function validarCUIT(cuit: string): FiscalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const cuitLimpio = cuit.replace(/\D/g, '');
  
  if (cuitLimpio.length !== 11) {
    errors.push('El CUIT debe tener 11 dígitos');
    return { valid: false, errors, warnings };
  }
  
  // Validar tipo (primeros 2 dígitos)
  const tipo = parseInt(cuitLimpio.substring(0, 2));
  const tiposValidos = [20, 23, 24, 27, 30, 33, 34];
  if (!tiposValidos.includes(tipo)) {
    errors.push('El tipo de CUIT no es válido');
  }
  
  // Validar dígito verificador
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  for (let i = 0; i < 10; i++) {
    suma += parseInt(cuitLimpio[i]) * pesos[i];
  }
  const residuo = 11 - (suma % 11);
  const digitoVerificador = residuo === 11 ? 0 : residuo === 10 ? 9 : residuo;
  
  if (parseInt(cuitLimpio[10]) !== digitoVerificador) {
    errors.push('El dígito verificador del CUIT es inválido');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida un CNPJ/CPF de Brasil
 */
function validarCNPJ(cnpj: string): FiscalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const cnpjLimpio = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpio.length !== 14) {
    errors.push('El CNPJ debe tener 14 dígitos');
    return { valid: false, errors, warnings };
  }
  
  // Verificar si todos los dígitos son iguales (inválido)
  if (/^(\d)\1{13}$/.test(cnpjLimpio)) {
    errors.push('CNPJ inválido');
    return { valid: false, errors, warnings };
  }
  
  // Validar primer dígito verificador
  let suma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    suma += parseInt(cnpjLimpio[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito1 = 11 - (suma % 11);
  digito1 = digito1 > 9 ? 0 : digito1;
  
  if (parseInt(cnpjLimpio[12]) !== digito1) {
    errors.push('Primer dígito verificador inválido');
  }
  
  // Validar segundo dígito verificador
  suma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    suma += parseInt(cnpjLimpio[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito2 = 11 - (suma % 11);
  digito2 = digito2 > 9 ? 0 : digito2;
  
  if (parseInt(cnpjLimpio[13]) !== digito2) {
    errors.push('Segundo dígito verificador inválido');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// CLOUD FUNCTIONS
// ============================================================================

/**
 * Valida un ID fiscal según el país
 */
export const validarIdFiscal = functions.https.onCall(
  async (data: { taxId: string; countryCode: CountryCode }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
    }
    
    const { taxId, countryCode } = data;
    
    if (!taxId || !countryCode) {
      throw new functions.https.HttpsError('invalid-argument', 'taxId y countryCode son requeridos');
    }
    
    let result: FiscalValidationResult;
    
    switch (countryCode) {
      case 'DO':
        result = validarRNC(taxId);
        break;
      case 'MX':
        result = validarRFC(taxId);
        break;
      case 'CO':
        result = validarNIT(taxId);
        break;
      case 'AR':
        result = validarCUIT(taxId);
        break;
      case 'BR':
        result = validarCNPJ(taxId);
        break;
      case 'US':
        // EIN tiene formato simple: XX-XXXXXXX
        result = {
          valid: /^\d{2}-?\d{7}$/.test(taxId.replace(/\D/g, '')),
          errors: [],
          warnings: [],
        };
        break;
      default:
        result = { valid: true, errors: [], warnings: ['País no soportado para validación'] };
    }
    
    return { success: true, ...result };
  }
);

/**
 * Obtiene la configuración de NCF para República Dominicana
 */
export const getNCFConfig = functions.https.onCall(
  withRateLimit(
    async (data: { farmId: string }, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId } = data;
      
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess) {
        throw new functions.https.HttpsError('permission-denied', 'Sin acceso a esta granja');
      }
      
      try {
        const configDoc = await db.doc(`farms/${farmId}/configuracion/ncf`).get();
        
        if (!configDoc.exists) {
          return {
            success: true,
            config: null,
            message: 'No hay configuración de NCF. Configure los datos fiscales primero.',
          };
        }
        
        const config = configDoc.data();
        
        // Verificar si hay NCF por vencer
        const fechaVencimiento = config?.fechaVencimiento?.toDate();
        const diasRestantes = fechaVencimiento 
          ? Math.ceil((fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null;
        
        return {
          success: true,
          config: {
            ...config,
            fechaVencimiento: fechaVencimiento?.toISOString(),
            diasRestantes,
            alerta: diasRestantes !== null && diasRestantes < 30 
              ? `Los NCF vencen en ${diasRestantes} días`
              : null,
          },
        };
      } catch (error) {
        functions.logger.error('Error obteniendo config NCF', error);
        throw new functions.https.HttpsError('internal', 'Error obteniendo configuración');
      }
    },
    RATE_LIMIT_PRESETS.relaxed
  )
);

/**
 * Genera el próximo NCF disponible
 */
export const generarNCF = functions.https.onCall(
  withRateLimit(
    async (data: { farmId: string; tipoNCF: string }, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId, tipoNCF } = data;
      
      if (!farmId || !tipoNCF) {
        throw new functions.https.HttpsError('invalid-argument', 'farmId y tipoNCF son requeridos');
      }
      
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess) {
        throw new functions.https.HttpsError('permission-denied', 'Sin acceso a esta granja');
      }
      
      try {
        const configRef = db.doc(`farms/${farmId}/configuracion/ncf`);
        
        const ncf = await db.runTransaction(async (transaction) => {
          const configDoc = await transaction.get(configRef);
          
          if (!configDoc.exists) {
            throw new functions.https.HttpsError(
              'failed-precondition',
              'No hay configuración de NCF. Configure los datos fiscales primero.'
            );
          }
          
          const config = configDoc.data()!;
          
          // Verificar vencimiento
          const fechaVencimiento = config.fechaVencimiento?.toDate();
          if (fechaVencimiento && fechaVencimiento < new Date()) {
            throw new functions.https.HttpsError(
              'failed-precondition',
              'Los NCF han vencido. Solicite nuevos comprobantes a la DGII.'
            );
          }
          
          // Obtener secuencia para el tipo de NCF
          const secuencias = config.secuencias || {};
          const secuenciaActual = (secuencias[tipoNCF] || 0) + 1;
          
          // Verificar que no se haya agotado el rango
          const rangoFin = config.rangosFin?.[tipoNCF];
          if (rangoFin && secuenciaActual > rangoFin) {
            throw new functions.https.HttpsError(
              'resource-exhausted',
              `Se agotaron los NCF tipo ${tipoNCF}. Solicite más a la DGII.`
            );
          }
          
          // Actualizar secuencia
          transaction.update(configRef, {
            [`secuencias.${tipoNCF}`]: secuenciaActual,
            updatedAt: admin.firestore.Timestamp.now(),
          });
          
          // Generar NCF
          const serie = config.serie || 'E';
          const ncfGenerado = `${serie}${tipoNCF}${secuenciaActual.toString().padStart(8, '0')}`;
          
          return ncfGenerado;
        });
        
        functions.logger.info('NCF generado', { farmId, tipoNCF, ncf });
        
        return { success: true, ncf };
      } catch (error) {
        functions.logger.error('Error generando NCF', error);
        if (error instanceof functions.https.HttpsError) throw error;
        throw new functions.https.HttpsError('internal', 'Error generando NCF');
      }
    },
    RATE_LIMIT_PRESETS.standard
  )
);

/**
 * Simula transmisión de documento a autoridad fiscal
 * NOTA: En producción, esto se conectaría a las APIs reales de DGII, SAT, etc.
 */
export const transmitirDocumentoFiscal = functions.https.onCall(
  withRateLimit(
    async (data: TransmitirDocumentoData, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId, documentoId } = data;
      
      if (!farmId || !documentoId) {
        throw new functions.https.HttpsError('invalid-argument', 'farmId y documentoId son requeridos');
      }
      
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess) {
        throw new functions.https.HttpsError('permission-denied', 'Sin acceso a esta granja');
      }
      
      try {
        const docRef = db.doc(`farms/${farmId}/documentosFiscales/${documentoId}`);
        const docSnap = await docRef.get();
        
        if (!docSnap.exists) {
          throw new functions.https.HttpsError('not-found', 'Documento no encontrado');
        }
        
        const documento = docSnap.data()!;
        
        if (documento.estado === 'TRANSMITIDO' || documento.estado === 'ACEPTADO') {
          throw new functions.https.HttpsError(
            'already-exists',
            'El documento ya fue transmitido'
          );
        }
        
        // Obtener config de la granja para saber el país
        const farmDoc = await db.doc(`farms/${farmId}`).get();
        const countryCode = farmDoc.data()?.regional?.countryCode || 'DO';
        
        // Simular transmisión (en producción conectar a API real)
        // Por ahora marcamos como pendiente de transmisión
        const transmisionResult = {
          estado: 'TRANSMITIDO',
          codigoRespuesta: `SIM-${Date.now()}`,
          mensajeRespuesta: 'Documento registrado para transmisión (modo simulación)',
          fechaTransmision: admin.firestore.Timestamp.now(),
        };
        
        await docRef.update({
          estado: transmisionResult.estado,
          codigoRespuesta: transmisionResult.codigoRespuesta,
          mensajeRespuesta: transmisionResult.mensajeRespuesta,
          fechaTransmision: transmisionResult.fechaTransmision,
          updatedAt: admin.firestore.Timestamp.now(),
        });
        
        functions.logger.info('Documento transmitido', {
          farmId,
          documentoId,
          countryCode,
          ...transmisionResult,
        });
        
        return {
          success: true,
          ...transmisionResult,
          nota: 'Modo simulación. En producción se conectará con la autoridad fiscal correspondiente.',
        };
      } catch (error) {
        functions.logger.error('Error transmitiendo documento', error);
        if (error instanceof functions.https.HttpsError) throw error;
        throw new functions.https.HttpsError('internal', 'Error transmitiendo documento');
      }
    },
    RATE_LIMIT_PRESETS.strict
  )
);

/**
 * Obtiene tasas de impuesto por país
 */
export const getTaxRates = functions.https.onCall(
  async (data: { countryCode: CountryCode }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
    }
    
    const { countryCode } = data;
    
    const taxRates: Record<CountryCode, { name: string; rate: number; rates?: { name: string; rate: number }[] }> = {
      DO: {
        name: 'ITBIS',
        rate: 0.18,
        rates: [
          { name: 'ITBIS 18%', rate: 0.18 },
          { name: 'ITBIS 16%', rate: 0.16 },
          { name: 'Exento', rate: 0 },
        ],
      },
      MX: {
        name: 'IVA',
        rate: 0.16,
        rates: [
          { name: 'IVA 16%', rate: 0.16 },
          { name: 'IVA 8% (Frontera)', rate: 0.08 },
          { name: 'Tasa 0%', rate: 0 },
          { name: 'Exento', rate: 0 },
        ],
      },
      CO: {
        name: 'IVA',
        rate: 0.19,
        rates: [
          { name: 'IVA 19%', rate: 0.19 },
          { name: 'IVA 5%', rate: 0.05 },
          { name: 'Excluido', rate: 0 },
          { name: 'Exento', rate: 0 },
        ],
      },
      AR: {
        name: 'IVA',
        rate: 0.21,
        rates: [
          { name: 'IVA 21%', rate: 0.21 },
          { name: 'IVA 10.5%', rate: 0.105 },
          { name: 'IVA 27%', rate: 0.27 },
          { name: 'Exento', rate: 0 },
        ],
      },
      BR: {
        name: 'ICMS',
        rate: 0.17,
        rates: [
          { name: 'ICMS 17%', rate: 0.17 },
          { name: 'ICMS 18%', rate: 0.18 },
          { name: 'ICMS 12%', rate: 0.12 },
          { name: 'ICMS 7%', rate: 0.07 },
        ],
      },
      US: {
        name: 'Sales Tax',
        rate: 0,
        rates: [
          { name: 'No Tax', rate: 0 },
        ],
      },
    };
    
    const rates = taxRates[countryCode];
    
    if (!rates) {
      return { success: false, error: 'País no soportado' };
    }
    
    return { success: true, ...rates };
  }
);

