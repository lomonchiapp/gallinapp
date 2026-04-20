"use strict";
/**
 * Alerts Cloud Functions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertsService = exports.getActiveAlerts = exports.resolveAlert = exports.createAlert = exports.onPaymentEvent = exports.onSecurityEvent = exports.scheduledAlertsCleanup = exports.scheduledMetricsCheck = void 0;
const functions = __importStar(require("firebase-functions"));
const alerts_service_1 = require("./alerts.service");
Object.defineProperty(exports, "alertsService", { enumerable: true, get: function () { return alerts_service_1.alertsService; } });
/**
 * Función programada para evaluar métricas cada 5 minutos
 */
exports.scheduledMetricsCheck = functions.pubsub
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
        await alerts_service_1.alertsService.evaluateMetrics(metrics);
        console.log('Metrics evaluation completed');
    }
    catch (error) {
        console.error('Error in scheduled metrics check:', error);
    }
});
/**
 * Función programada para limpiar alertas antiguas (diario)
 */
exports.scheduledAlertsCleanup = functions.pubsub
    .schedule('0 2 * * *') // 2 AM diario
    .timeZone('America/Santo_Domingo')
    .onRun(async () => {
    try {
        const deleted = await alerts_service_1.alertsService.cleanupOldAlerts(30);
        console.log(`Alerts cleanup completed: ${deleted} alerts deleted`);
    }
    catch (error) {
        console.error('Error in alerts cleanup:', error);
    }
});
/**
 * Trigger para alertas de seguridad
 */
exports.onSecurityEvent = functions.firestore
    .document('_securityLogs/{logId}')
    .onCreate(async (snapshot) => {
    const data = snapshot.data();
    // Crear alerta para eventos de seguridad importantes
    if (data.type === 'auth_failure' || data.type === 'blocked_request') {
        await alerts_service_1.alertsService.createAlert({
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
exports.onPaymentEvent = functions.firestore
    .document('payments/{paymentId}')
    .onWrite(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();
    // Alerta de pago fallido
    if (after?.status === 'failed' && before?.status !== 'failed') {
        await alerts_service_1.alertsService.createAlert({
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
        await alerts_service_1.alertsService.createAlert({
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
exports.createAlert = functions.https.onCall(async (data, context) => {
    // Verificar autenticación y rol admin
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    // TODO: Verificar rol admin
    const { title, message, severity, category, source, metadata } = data;
    if (!title || !message || !severity || !category || !source) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
    }
    const alertId = await alerts_service_1.alertsService.createAlert({
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
exports.resolveAlert = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const { alertId } = data;
    if (!alertId) {
        throw new functions.https.HttpsError('invalid-argument', 'Alert ID required');
    }
    await alerts_service_1.alertsService.resolveAlert(alertId, context.auth.uid);
    return { success: true };
});
/**
 * HTTP endpoint para obtener alertas activas
 */
exports.getActiveAlerts = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    const { limit = 50 } = data || {};
    const alerts = await alerts_service_1.alertsService.getActiveAlerts(limit);
    return { alerts };
});
//# sourceMappingURL=index.js.map