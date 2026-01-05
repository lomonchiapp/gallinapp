/**
 * Cloud Functions para Ventas PRO
 * Manejo de ventas profesionales multi-país
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { withRateLimit, RATE_LIMIT_PRESETS } from '../middleware/rateLimit';
import { validateInput, sanitizeObject, verifyFarmAccess } from '../middleware/security';

// Inicializar si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ============================================================================
// TIPOS
// ============================================================================

interface GenerarNumeroVentaData {
  farmId: string;
}

interface GenerarDocumentoFiscalData {
  farmId: string;
  ventaId: string;
  tipoDocumento: 'FACTURA' | 'RECIBO' | 'NOTA_CREDITO' | 'CONSUMIDOR_FINAL';
}

interface RegistrarPagoData {
  farmId: string;
  ventaId: string;
  monto: number;
  metodoPago: string;
  referencia?: string;
}

interface CancelarVentaData {
  farmId: string;
  ventaId: string;
  motivo: string;
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Genera el próximo número de venta para una granja
 */
async function getNextVentaNumber(farmId: string): Promise<string> {
  const configRef = db.doc(`farms/${farmId}/ventasProConfig/config`);
  
  const result = await db.runTransaction(async (transaction) => {
    const configDoc = await transaction.get(configRef);
    
    let prefijo = 'VTA';
    let numero = 1;
    
    if (configDoc.exists) {
      const data = configDoc.data()!;
      prefijo = data.prefijoVenta || 'VTA';
      numero = (data.numeroVentaActual || 0) + 1;
      
      transaction.update(configRef, {
        numeroVentaActual: numero,
        updatedAt: admin.firestore.Timestamp.now(),
      });
    } else {
      transaction.set(configRef, {
        prefijoVenta: 'VTA',
        numeroVentaActual: 1,
        formatoNumero: '{prefijo}-{anio}-{numero:6}',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });
    }
    
    const anio = new Date().getFullYear();
    return `${prefijo}-${anio}-${numero.toString().padStart(6, '0')}`;
  });
  
  return result;
}

/**
 * Obtiene la configuración fiscal de una granja
 */
async function getFarmFiscalConfig(farmId: string): Promise<any> {
  const farmDoc = await db.doc(`farms/${farmId}`).get();
  
  if (!farmDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Granja no encontrada');
  }
  
  const farmData = farmDoc.data()!;
  return farmData.regional?.fiscal || {
    taxRate: 0.18,
    taxName: 'ITBIS',
    taxIncluded: false,
  };
}

// ============================================================================
// CLOUD FUNCTIONS
// ============================================================================

/**
 * Genera el próximo número de venta
 */
export const generarNumeroVenta = functions.https.onCall(
  withRateLimit(
    async (data: GenerarNumeroVentaData, context) => {
      // Verificar autenticación
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId } = data;
      
      if (!farmId) {
        throw new functions.https.HttpsError('invalid-argument', 'farmId es requerido');
      }
      
      // Verificar acceso a la granja
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess) {
        throw new functions.https.HttpsError('permission-denied', 'Sin acceso a esta granja');
      }
      
      try {
        const numero = await getNextVentaNumber(farmId);
        
        functions.logger.info('Número de venta generado', {
          farmId,
          numero,
          userId: context.auth.uid,
        });
        
        return { success: true, numero };
      } catch (error) {
        functions.logger.error('Error generando número de venta', error);
        throw new functions.https.HttpsError('internal', 'Error generando número de venta');
      }
    },
    RATE_LIMIT_PRESETS.standard
  )
);

/**
 * Genera un documento fiscal (factura, recibo, etc.)
 */
export const generarDocumentoFiscal = functions.https.onCall(
  withRateLimit(
    async (data: GenerarDocumentoFiscalData, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId, ventaId, tipoDocumento } = data;
      
      // Validar datos
      if (!farmId || !ventaId || !tipoDocumento) {
        throw new functions.https.HttpsError('invalid-argument', 'Datos incompletos');
      }
      
      // Verificar acceso
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess) {
        throw new functions.https.HttpsError('permission-denied', 'Sin acceso a esta granja');
      }
      
      try {
        // Obtener la venta
        const ventaDoc = await db.doc(`farms/${farmId}/ventasPro/${ventaId}`).get();
        if (!ventaDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'Venta no encontrada');
        }
        
        const venta = ventaDoc.data()!;
        
        // Obtener configuración fiscal
        const fiscalConfig = await getFarmFiscalConfig(farmId);
        
        // Generar número de documento fiscal
        const docFiscalRef = db.collection(`farms/${farmId}/documentosFiscales`);
        const docCount = (await docFiscalRef.count().get()).data().count;
        const numeroDocumento = `${tipoDocumento.substring(0, 3)}-${new Date().getFullYear()}-${(docCount + 1).toString().padStart(6, '0')}`;
        
        // Crear documento fiscal
        const documentoFiscal = {
          tipo: tipoDocumento,
          numero: numeroDocumento,
          ventaId,
          farmId,
          cliente: venta.cliente,
          items: venta.items,
          subtotal: venta.subtotal,
          impuestoTotal: venta.impuestoTotal,
          total: venta.total,
          currency: venta.currency,
          taxRate: fiscalConfig.taxRate,
          taxName: fiscalConfig.taxName,
          estado: 'GENERADO',
          fechaEmision: admin.firestore.Timestamp.now(),
          createdBy: context.auth.uid,
          createdAt: admin.firestore.Timestamp.now(),
        };
        
        const docRef = await docFiscalRef.add(documentoFiscal);
        
        // Actualizar la venta con referencia al documento
        await ventaDoc.ref.update({
          'documentoFiscal.id': docRef.id,
          'documentoFiscal.tipo': tipoDocumento,
          'documentoFiscal.numero': numeroDocumento,
          'documentoFiscal.estado': 'GENERADO',
          updatedAt: admin.firestore.Timestamp.now(),
        });
        
        functions.logger.info('Documento fiscal generado', {
          farmId,
          ventaId,
          documentoId: docRef.id,
          numero: numeroDocumento,
        });
        
        return {
          success: true,
          documentoId: docRef.id,
          numero: numeroDocumento,
        };
      } catch (error) {
        functions.logger.error('Error generando documento fiscal', error);
        if (error instanceof functions.https.HttpsError) throw error;
        throw new functions.https.HttpsError('internal', 'Error generando documento fiscal');
      }
    },
    RATE_LIMIT_PRESETS.standard
  )
);

/**
 * Registra un pago para una venta
 */
export const registrarPagoVenta = functions.https.onCall(
  withRateLimit(
    async (data: RegistrarPagoData, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId, ventaId, monto, metodoPago, referencia } = data;
      
      if (!farmId || !ventaId || !monto || !metodoPago) {
        throw new functions.https.HttpsError('invalid-argument', 'Datos incompletos');
      }
      
      if (monto <= 0) {
        throw new functions.https.HttpsError('invalid-argument', 'El monto debe ser positivo');
      }
      
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess) {
        throw new functions.https.HttpsError('permission-denied', 'Sin acceso a esta granja');
      }
      
      try {
        const ventaRef = db.doc(`farms/${farmId}/ventasPro/${ventaId}`);
        
        const result = await db.runTransaction(async (transaction) => {
          const ventaDoc = await transaction.get(ventaRef);
          
          if (!ventaDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Venta no encontrada');
          }
          
          const venta = ventaDoc.data()!;
          
          if (venta.estado === 'CANCELADA' || venta.estado === 'ANULADA') {
            throw new functions.https.HttpsError('failed-precondition', 'No se puede pagar una venta cancelada');
          }
          
          // Crear el pago
          const pagoId = `pago_${Date.now()}`;
          const pago = {
            id: pagoId,
            ventaId,
            monto,
            currency: venta.currency,
            metodoPago,
            referencia: referencia || null,
            fechaPago: admin.firestore.Timestamp.now(),
            fechaRegistro: admin.firestore.Timestamp.now(),
            registradoPor: context.auth!.uid,
          };
          
          // Calcular nuevos totales
          const nuevoMontoPagado = (venta.montoPagado || 0) + monto;
          const nuevoSaldoPendiente = venta.total - nuevoMontoPagado;
          
          // Determinar nuevo estado de pago
          let nuevoEstadoPago: string;
          let nuevoEstado = venta.estado;
          
          if (nuevoSaldoPendiente <= 0) {
            nuevoEstadoPago = 'PAGADO';
            nuevoEstado = 'PAGADA';
          } else if (nuevoMontoPagado > 0) {
            nuevoEstadoPago = 'PARCIAL';
            nuevoEstado = 'PARCIALMENTE_PAGADA';
          } else {
            nuevoEstadoPago = 'PENDIENTE';
          }
          
          // Actualizar venta
          const pagos = venta.pagos || [];
          pagos.push(pago);
          
          transaction.update(ventaRef, {
            pagos,
            montoPagado: nuevoMontoPagado,
            saldoPendiente: Math.max(0, nuevoSaldoPendiente),
            estadoPago: nuevoEstadoPago,
            estado: nuevoEstado,
            updatedAt: admin.firestore.Timestamp.now(),
          });
          
          return {
            pagoId,
            nuevoMontoPagado,
            nuevoSaldoPendiente: Math.max(0, nuevoSaldoPendiente),
            nuevoEstadoPago,
          };
        });
        
        functions.logger.info('Pago registrado', {
          farmId,
          ventaId,
          ...result,
        });
        
        return { success: true, ...result };
      } catch (error) {
        functions.logger.error('Error registrando pago', error);
        if (error instanceof functions.https.HttpsError) throw error;
        throw new functions.https.HttpsError('internal', 'Error registrando pago');
      }
    },
    RATE_LIMIT_PRESETS.payment
  )
);

/**
 * Cancela una venta
 */
export const cancelarVenta = functions.https.onCall(
  withRateLimit(
    async (data: CancelarVentaData, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId, ventaId, motivo } = data;
      
      if (!farmId || !ventaId || !motivo) {
        throw new functions.https.HttpsError('invalid-argument', 'Datos incompletos');
      }
      
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess || (access.role !== 'owner' && access.role !== 'admin')) {
        throw new functions.https.HttpsError('permission-denied', 'Solo administradores pueden cancelar ventas');
      }
      
      try {
        const ventaRef = db.doc(`farms/${farmId}/ventasPro/${ventaId}`);
        const ventaDoc = await ventaRef.get();
        
        if (!ventaDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'Venta no encontrada');
        }
        
        const venta = ventaDoc.data()!;
        
        if (venta.estadoPago === 'PAGADO') {
          throw new functions.https.HttpsError(
            'failed-precondition',
            'No se puede cancelar una venta completamente pagada. Use nota de crédito.'
          );
        }
        
        if (venta.estado === 'CANCELADA' || venta.estado === 'ANULADA') {
          throw new functions.https.HttpsError('failed-precondition', 'La venta ya está cancelada');
        }
        
        await ventaRef.update({
          estado: 'CANCELADA',
          cancelledAt: admin.firestore.Timestamp.now(),
          cancelledBy: context.auth.uid,
          motivoCancelacion: motivo,
          updatedAt: admin.firestore.Timestamp.now(),
        });
        
        // Registrar en audit log
        await db.collection(`farms/${farmId}/audit_log`).add({
          tipo: 'VENTA_CANCELADA',
          entidad: 'ventasPro',
          entidadId: ventaId,
          descripcion: `Venta ${venta.numero} cancelada: ${motivo}`,
          userId: context.auth.uid,
          timestamp: admin.firestore.Timestamp.now(),
          metadata: {
            numero: venta.numero,
            total: venta.total,
            motivo,
          },
        });
        
        functions.logger.info('Venta cancelada', {
          farmId,
          ventaId,
          numero: venta.numero,
          motivo,
          userId: context.auth.uid,
        });
        
        return { success: true, message: 'Venta cancelada correctamente' };
      } catch (error) {
        functions.logger.error('Error cancelando venta', error);
        if (error instanceof functions.https.HttpsError) throw error;
        throw new functions.https.HttpsError('internal', 'Error cancelando venta');
      }
    },
    RATE_LIMIT_PRESETS.strict
  )
);

/**
 * Obtiene resumen de ventas para un período
 */
export const getResumenVentas = functions.https.onCall(
  withRateLimit(
    async (data: { farmId: string; fechaInicio: string; fechaFin: string }, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      
      const { farmId, fechaInicio, fechaFin } = data;
      
      if (!farmId || !fechaInicio || !fechaFin) {
        throw new functions.https.HttpsError('invalid-argument', 'Datos incompletos');
      }
      
      const access = await verifyFarmAccess(context.auth.uid, farmId);
      if (!access.hasAccess) {
        throw new functions.https.HttpsError('permission-denied', 'Sin acceso a esta granja');
      }
      
      try {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        const ventasRef = db.collection(`farms/${farmId}/ventasPro`);
        const query = ventasRef
          .where('fecha', '>=', admin.firestore.Timestamp.fromDate(inicio))
          .where('fecha', '<=', admin.firestore.Timestamp.fromDate(fin))
          .where('estado', '!=', 'CANCELADA');
        
        const snapshot = await query.get();
        
        let totalVentas = 0;
        let totalImpuestos = 0;
        let cantidadVentas = 0;
        const porMetodoPago: Record<string, number> = {};
        const porEstado: Record<string, number> = {};
        
        snapshot.docs.forEach(doc => {
          const venta = doc.data();
          totalVentas += venta.total || 0;
          totalImpuestos += venta.impuestoTotal || 0;
          cantidadVentas++;
          
          const metodo = venta.metodoPago || 'OTRO';
          porMetodoPago[metodo] = (porMetodoPago[metodo] || 0) + (venta.total || 0);
          
          const estado = venta.estado || 'PENDIENTE';
          porEstado[estado] = (porEstado[estado] || 0) + 1;
        });
        
        return {
          success: true,
          resumen: {
            periodo: { inicio: fechaInicio, fin: fechaFin },
            totalVentas: Math.round(totalVentas * 100) / 100,
            totalImpuestos: Math.round(totalImpuestos * 100) / 100,
            cantidadVentas,
            promedioVenta: cantidadVentas > 0 
              ? Math.round((totalVentas / cantidadVentas) * 100) / 100 
              : 0,
            porMetodoPago,
            porEstado,
          },
        };
      } catch (error) {
        functions.logger.error('Error obteniendo resumen', error);
        throw new functions.https.HttpsError('internal', 'Error obteniendo resumen');
      }
    },
    RATE_LIMIT_PRESETS.relaxed
  )
);

