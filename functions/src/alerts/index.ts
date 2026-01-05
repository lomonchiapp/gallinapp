/**
 * Alerts Cloud Functions
 */

import * as functions from 'firebase-functions';
import { alertsService } from './alerts.service';

/**
 * Función programada para evaluar métricas cada 5 minutos
 */
export const scheduledMetricsCheck = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    try {
      // TODO: Obtener métricas reales de los servicios
      // Por ahora, ejemplo de estructura
      const metrics = {
        error_rate: 0, // Porcentaje de errores
        avg_latency_ms: 500, // Latencia promedio
        blocked_requests: 0, // Requests bloqueados por rate limiting
        active_users: 0, // Usuarios activos
      };

      await alertsService.evaluateMetrics(metrics);
      console.log('Metrics evaluation completed');
    } catch (error) {
      console.error('Error in scheduled metrics check:', error);
    }
  });

/**
 * Función programada para limpiar alertas antiguas (diario)
 */
export const scheduledAlertsCleanup = functions.pubsub
  .schedule('0 2 * * *') // 2 AM diario
  .timeZone('America/Santo_Domingo')
  .onRun(async () => {
    try {
      const deleted = await alertsService.cleanupOldAlerts(30);
      console.log(`Alerts cleanup completed: ${deleted} alerts deleted`);
    } catch (error) {
      console.error('Error in alerts cleanup:', error);
    }
  });

/**
 * Trigger para alertas de seguridad
 */
export const onSecurityEvent = functions.firestore
  .document('_securityLogs/{logId}')
  .onCreate(async (snapshot) => {
    const data = snapshot.data();
    
    // Crear alerta para eventos de seguridad importantes
    if (data.type === 'auth_failure' || data.type === 'blocked_request') {
      await alertsService.createAlert({
        title: `Security Event: ${data.type}`,
        message: `IP: ${data.ip}, Path: ${data.path}`,
        severity: data.type === 'blocked_request' ? 'high' : 'medium',
        category: 'security',
        source: 'security_monitor',
        metadata: data,
      });
    }
  });

/**
 * Trigger para alertas de pago
 */
export const onPaymentEvent = functions.firestore
  .document('payments/{paymentId}')
  .onWrite(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();
    
    // Alerta de pago fallido
    if (after?.status === 'failed' && before?.status !== 'failed') {
      await alertsService.createAlert({
        title: 'Payment Failed',
        message: `Payment ${context.params.paymentId} failed for user ${after.userId}`,
        severity: 'high',
        category: 'subscription',
        source: 'payment_monitor',
        metadata: {
          paymentId: context.params.paymentId,
          userId: after.userId,
          amount: after.amount,
          error: after.errorMessage,
        },
      });
    }
    
    // Alerta informativa de nueva suscripción PRO
    if (after?.plan === 'PRO' && before?.plan !== 'PRO') {
      await alertsService.createAlert({
        title: 'New PRO Subscription',
        message: `User ${after.userId} upgraded to PRO plan`,
        severity: 'info',
        category: 'business',
        source: 'subscription_monitor',
        metadata: {
          userId: after.userId,
          previousPlan: before?.plan || 'FREE',
        },
      });
    }
  });

/**
 * HTTP endpoint para crear alertas manualmente
 */
export const createAlert = functions.https.onCall(async (data, context) => {
  // Verificar autenticación y rol admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  // TODO: Verificar rol admin
  
  const { title, message, severity, category, source, metadata } = data;
  
  if (!title || !message || !severity || !category || !source) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  const alertId = await alertsService.createAlert({
    title,
    message,
    severity,
    category,
    source,
    metadata,
  });

  return { success: true, alertId };
});

/**
 * HTTP endpoint para resolver alertas
 */
export const resolveAlert = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { alertId } = data;
  
  if (!alertId) {
    throw new functions.https.HttpsError('invalid-argument', 'Alert ID required');
  }

  await alertsService.resolveAlert(alertId, context.auth.uid);

  return { success: true };
});

/**
 * HTTP endpoint para obtener alertas activas
 */
export const getActiveAlerts = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { limit = 50 } = data || {};
  const alerts = await alertsService.getActiveAlerts(limit);

  return { alerts };
});

// Exportar servicio para uso interno
export { alertsService };

