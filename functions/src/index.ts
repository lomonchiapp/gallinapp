/**
 * Firebase Cloud Functions for Gallinapp
 * Funciones centralizadas para admin, ventas PRO, webhooks y más
 */

import * as functions from 'firebase-functions';
import { cleanupExpiredRateLimits } from './middleware/rateLimit';

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

// Admin user management
export * from './admin/users';

// Admin notifications
export * from './admin/notifications';

// ============================================================================
// VENTAS PRO FUNCTIONS
// ============================================================================

// Ventas profesionales multi-país
export {
  generarNumeroVenta,
  generarDocumentoFiscal,
  registrarPagoVenta,
  cancelarVenta,
  getResumenVentas,
} from './ventas-pro';

// Funciones fiscales
export {
  validarIdFiscal,
  getNCFConfig,
  generarNCF,
  transmitirDocumentoFiscal,
  getTaxRates,
} from './ventas-pro/fiscal';

// ============================================================================
// WEBHOOKS
// ============================================================================

// Webhooks para pasarelas de pago
export {
  stripeWebhook,
  revenueCatWebhook,
  healthCheck,
} from './webhooks';

// ============================================================================
// ALERTS & MONITORING
// ============================================================================

// Sistema de alertas
export * from './alerts';

// ============================================================================
// MIDDLEWARE (exportado para uso interno)
// ============================================================================

// Middleware utilities
export * from './middleware';

// ============================================================================
// SCHEDULED FUNCTIONS
// ============================================================================

// Ejecutar limpieza de rate limits cada día a las 3 AM
export const scheduledRateLimitCleanup = functions.pubsub
  .schedule('0 3 * * *')
  .timeZone('America/Santo_Domingo')
  .onRun(async () => {
    const result = await cleanupExpiredRateLimits();
    console.log(`Rate limit cleanup completed: ${result.deleted} entries deleted`);
  });

// Limpieza de webhooks logs antiguos (cada semana)
export const scheduledWebhookLogsCleanup = functions.pubsub
  .schedule('0 4 * * 0') // Domingos a las 4 AM
  .timeZone('America/Santo_Domingo')
  .onRun(async () => {
    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    
    const db = admin.firestore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const snapshot = await db.collection('_webhookLogs')
      .where('timestamp', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .limit(500)
      .get();
    
    if (snapshot.empty) {
      console.log('No webhook logs to cleanup');
      return;
    }
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    
    console.log(`Webhook logs cleanup completed: ${snapshot.size} entries deleted`);
  });

// Verificación de NCFs por vencer (diario)
export const scheduledNCFExpirationCheck = functions.pubsub
  .schedule('0 8 * * *') // Todos los días a las 8 AM
  .timeZone('America/Santo_Domingo')
  .onRun(async () => {
    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    
    const db = admin.firestore();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    // Buscar granjas con NCF por vencer
    const farmsSnapshot = await db.collection('farms').get();
    
    for (const farmDoc of farmsSnapshot.docs) {
      const ncfConfigDoc = await db.doc(`farms/${farmDoc.id}/configuracion/ncf`).get();
      
      if (!ncfConfigDoc.exists) continue;
      
      const ncfConfig = ncfConfigDoc.data()!;
      const fechaVencimiento = ncfConfig.fechaVencimiento?.toDate();
      
      if (fechaVencimiento && fechaVencimiento < thirtyDaysFromNow) {
        const diasRestantes = Math.ceil(
          (fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        
        // Crear notificación
        await db.collection(`farms/${farmDoc.id}/notifications`).add({
          tipo: 'NCF_POR_VENCER',
          titulo: 'NCF por vencer',
          mensaje: `Los NCF de su granja vencerán en ${diasRestantes} días. Solicite nuevos a la DGII.`,
          leida: false,
          createdAt: admin.firestore.Timestamp.now(),
        });
        
        console.log(`NCF expiration alert sent for farm ${farmDoc.id}`);
      }
    }
  });



